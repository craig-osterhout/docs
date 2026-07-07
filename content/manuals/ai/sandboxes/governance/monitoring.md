---
title: Monitoring policies
weight: 25
description: Inspect active policies and monitor sandbox network traffic with sbx policy ls and sbx policy log.
keywords: docker sandboxes, policy monitoring, sbx policy ls, sbx policy log, network traffic, policy debugging
---

`sbx policy ls` and `sbx policy log` give you a combined view of all active
policies and sandbox network activity, regardless of whether those policies
come from local configuration or organization governance. They're useful both
for verifying rules you've written and for debugging why a request is being
blocked or allowed.

## Listing policies

Use `sbx policy ls` to see an overview of all active policies:

```console
$ sbx policy ls
POLICY                       SOURCE   APPLIES TO     SUMMARY
default-ai-services          local    all            network: 2 allow
default-fs-read-allow-all    local    all            filesystem read: 1 allow
default-fs-write-allow-all   local    all            filesystem write: 1 allow
kit:docs                     kit      sandbox:docs   network: 2 allow
```

The columns are:

- `POLICY`: the policy's name, or its rule name (or ID) when it isn't part of
  a named policy.
- `SOURCE`: where the policy came from. `local` is a policy from your local
  configuration — a preset default or one you added with `sbx policy`. `kit`
  is a policy added by a [kit](../customize/kits.md#control-network-access).
  `org` is a policy set by your organization.
- `APPLIES TO`: which sandboxes the policy applies to. `all` means the policy
  is global. `sandbox:<name>` means it's scoped to the named sandbox.
- `SUMMARY`: a count of allow/deny decisions in the policy, grouped by
  resource type (`network`, `filesystem read`, `filesystem write`).

Use `--type network` or `--type filesystem` to show only policies of that
type, `--source local`/`org`/`kit` to filter by where a policy came from, and
`--decision allow`/`deny` to filter by decision:

```console
$ sbx policy ls --source org --decision deny
```

Add `--json` to get the same filtered rule set as machine-readable output.

Pass a sandbox name to see the policies that apply to it:

```console
$ sbx policy ls my-sandbox
Policy for sandbox: my-sandbox
NETWORK
  allow 2 hosts from default-ai-services

FILESYSTEM
  read allow all paths from default-fs-read-allow-all
  write allow all paths from default-fs-write-allow-all

Details: sbx policy ls my-sandbox --wide
```

Without a sandbox argument, `sbx policy ls` shows every policy across all
sandboxes.

### Detailed rule view

Add `--wide` to see the individual rules behind each policy, including rule
IDs, resources, and (when relevant) status:

```console
$ sbx policy ls --wide
SOURCE   APPLIES TO     POLICY/RULE                  RULE_ID                                TYPE               DECISION   RESOURCES
local    all            default-ai-services          3a0402e0-f4d5-4c19-9ce6-6d205bf01a8f   network            allow      api.anthropic.com:443
                                                                                                                          api.openai.com:443
local    all            default-fs-read-allow-all    9b1f2c3d-8e4a-4b6c-9d1e-2f3a4b5c6d7e   filesystem:read    allow      **
local    all            default-fs-write-allow-all   1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f   filesystem:write   allow      **
kit      sandbox:docs   kit:docs                     7f8e9d0c-1b2a-4c3d-8e5f-6a7b8c9d0e1f   network            allow      api.github.com
                                                                                                                          registry.npmjs.org
```

The columns are:

- `SOURCE`: same as the overview — `local`, `kit`, or `org`.
- `APPLIES TO`: which sandboxes the rule applies to.
- `POLICY/RULE`: the rule's identity, shown as `<policy> / <rule>` when it
  belongs to a named policy, or the rule name (or ID) otherwise.
- `RULE_ID`: the rule's unique ID, for use with `sbx policy rm network --id`.
- `TYPE`: the rule domain. Network rules show as `network`. Filesystem rules
  show as `filesystem:read` or `filesystem:write`, depending on the access the
  rule controls.
- `DECISION`: whether the rule allows or denies the resource.
- `RESOURCES`: the hosts or patterns the rule applies to.

Use [`sbx policy inspect`](#inspecting-a-policy-or-rule) to see this same
detail for a single policy or rule, without scanning the full table.

When organization governance is active, the default overview's first line
summarizes governance, sync, and hidden-rule status:

```console
$ sbx policy ls
Governance: Managed by my-org | Sync: OK, last synced 08:21:01 | Hidden: 9 inactive rules. Show with: sbx policy ls --include-inactive

POLICY                                           SOURCE   APPLIES TO   SUMMARY
default filesystem / allow home subdirectories   org      all          filesystem write: 1 allow
default filesystem / deny home directory         org      all          filesystem write: 1 deny
default network / allow AI services              org      all          network: 2 allow
default network / allow Docker services          org      all          network: 2 allow
```

`--wide` prints the same governance and sync information as a header block
instead of a single line:

```console
$ sbx policy ls --wide
Policy rules
------------
Governance  Managed by my-org
Sync        OK, last synced 08:21:01
Hidden      9 inactive rules. Show with: sbx policy ls --include-inactive

SOURCE   APPLIES TO   POLICY/RULE                                      RULE_ID   TYPE               DECISION   RESOURCES
org      all          default filesystem / allow home subdirectories   ...       filesystem:write   allow      ~/**
org      all          default filesystem / deny home directory         ...       filesystem:write   deny       ~/
org      all          default network / allow AI services              ...       network            allow      api.anthropic.com
                                                                                                                 api.openai.com
org      all          default network / allow Docker services          ...       network            allow      *.docker.com
                                                                                                                 *.docker.io
```

The `Governance` line shows which organization manages the policy, and `Sync`
confirms the daemon has pulled the latest rules. If the sync state shows an
error or a stale timestamp, the daemon may not have the most recent org policy.
Run `sbx policy reset` to force a fresh pull. The `Hidden` line reports how many
inactive rules are suppressed and how to reveal them.

### Showing inactive rules

When organization governance is active, local and kit-defined rules are not
evaluated, so `sbx policy ls` hides them by default. To see them — for
example, to confirm which local rules the organization policy overrides — pass
`--include-inactive`. Combine it with `--wide` to see each rule's `STATUS` and
the reason it's inactive:

```console
$ sbx policy ls --wide --include-inactive
Policy rules
------------
Governance  Managed by my-org
Sync        OK, last synced 08:41:06

SOURCE   APPLIES TO   POLICY/RULE                                      TYPE               DECISION   STATUS                        RESOURCES
local                 default-fs-read-allow-all                        filesystem:read    allow      inactive — corporate policy   **
                                                                                                     takes precedence and does
                                                                                                     not delegate this rule type
                                                                                                     to local policy.
local                 default-fs-write-allow-all                       filesystem:write   allow      inactive — corporate policy   **
                                                                                                     takes precedence and does
                                                                                                     not delegate this rule type
                                                                                                     to local policy.
org      all          default filesystem / allow home subdirectories   filesystem:write   allow      active                        ~/**
org      all          default filesystem / deny home directory         filesystem:write   deny       active                        ~/
```

Inactive rules show `inactive` in the `STATUS` column, along with the reason.
They have no effect while organization governance is active.

### Filesystem rules

`sbx policy ls` lists filesystem rules alongside network rules. Filesystem
rules control which host paths a sandbox can mount as a workspace. Pass
`--type filesystem` to show only them, and add `--wide` to see the individual
rules:

```console
$ sbx policy ls --type filesystem --wide
SOURCE   APPLIES TO   POLICY/RULE                  RULE_ID                                TYPE               DECISION   RESOURCES
local    all          default-fs-read-allow-all    9b1f2c3d-8e4a-4b6c-9d1e-2f3a4b5c6d7e   filesystem:read    allow      **
local    all          default-fs-write-allow-all   1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f   filesystem:write   allow      **
```

A writable workspace mount must be allowed by both a `filesystem:read` and a
`filesystem:write` rule; a read-only mount needs only `filesystem:read`. The
default local policy allows read and write access to all paths, shown as the
two `default-fs-*` rules above. For the rule syntax and path patterns, see
[Policy concepts](concepts.md#filesystem-rules).

## Inspecting a policy or rule

Use `sbx policy inspect <policy-or-rule>` to see full detail for a single
policy or rule, by policy ID, policy name, rule ID, or rule name. This is
often faster than scanning the `--wide` table when you already know what
you're looking for:

```console
$ sbx policy inspect "default-fs-read-allow-all"
Policy:      default-fs-read-allow-all
Policy ID:   pol_06f23zx7441peq32fpvbvbz00dhz
Source:      local
Applies to:  all
Status:      active

Rules in this policy:
DECISION   RESOURCE   TYPE              RULE                                   STATUS
allow      **         filesystem:read   9b1f2c3d-8e4a-4b6c-9d1e-2f3a4b5c6d7e   active

Rule IDs:
RULE                                   RULE_ID
9b1f2c3d-8e4a-4b6c-9d1e-2f3a4b5c6d7e   9b1f2c3d-8e4a-4b6c-9d1e-2f3a4b5c6d7e
```

Use `sbx policy ls` to find a policy name, and `sbx policy ls --wide` to find
a rule ID or resource value to pass to `inspect`.

## Monitoring traffic

Use `sbx policy log` to see which hosts your sandboxes have contacted and
which rules matched:

```console
$ sbx policy log
Blocked requests:
SANDBOX      TYPE     HOST                   PROXY        RULE            REASON         LAST SEEN        COUNT
my-sandbox   network  blocked.example.com    transparent  domain-blocked  default-deny   10:15:25 29-Jan  1

Allowed requests:
SANDBOX      TYPE     HOST                   PROXY          RULE             REASON   LAST SEEN        COUNT
my-sandbox   network  api.anthropic.com      forward        domain-allowed            10:15:23 29-Jan  42
my-sandbox   network  registry.npmjs.org     forward-bypass domain-allowed            10:15:20 29-Jan  18
my-sandbox   network  app.example.com        browser-open                             10:15:10 29-Jan  1
```

The `PROXY` column shows how the request left the sandbox:

| Value | Description |
| ----- | ----------- |
| `forward` | Routed through the forward proxy. Supports [credential injection](../security/credentials.md). |
| `forward-bypass` | Routed through the forward proxy without credential injection. |
| `transparent` | Intercepted by the transparent proxy. Policy is enforced but credential injection is not available. |
| `network` | Non-HTTP traffic (raw TCP, UDP, ICMP). TCP can be allowed with a policy rule; UDP and ICMP are always blocked. |
| `browser-open` | A sandbox process requested opening a URL in the host browser. Policy is enforced before opening the URL. |

The `RULE` column identifies the policy rule that matched the request. The
`REASON` column includes extra context when the daemon records one.

Filter by sandbox name by passing it as an argument:

```console
$ sbx policy log my-sandbox
```

Use `--limit N` to show only the last `N` entries, `--json` for
machine-readable output, or `--type network` to filter by policy type.
`sbx policy log` records network traffic only; filesystem mount decisions
aren't available in the log yet.
