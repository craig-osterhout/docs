---
title: Explore VEX statements in Docker Hardened Images
description: |
  Scan a Docker Hardened Image with and without VEX, audit every CVE suppression
  and its justification, and see how VEX-based transparency compares with scanner
  ignore files and distro advisory feeds.
summary: >
  Scan a Docker Hardened Image with and without VEX, audit every suppression
  and its justification, then compare VEX transparency with scanner ignore
  files and distro advisory feeds to see what each approach records.
keywords: vex, openvex, not_affected, under_investigation, affected, cve,docker scout, dhi, vulnerability
tags: [dhi]
params:
  proficiencyLevel: Intermediate
  time: 35 minutes
  prerequisites:
    - Docker Desktop with access to dhi.io (DHI subscription)
    - A VEX-enabled scanner (Docker Scout, Trivy, or Grype)
    - jq installed (optional, for filtering)
---

Standard vulnerability scanners report CVEs against packages present in an
image. With Docker Hardened Images, those packages are there by design, but each
reported CVE has a VEX statement explaining whether it is exploitable in this
specific product configuration. This guide walks through scanning a Docker
Hardened Image with and without VEX, auditing the justification behind every
suppression, and comparing VEX transparency with other suppression mechanisms.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/), authenticated
  to `dhi.io`. Sign in with `docker login dhi.io`. Docker Desktop includes
  Docker Scout, which is used to fetch the VEX attestation.
- A vulnerability scanner. This guide shows examples for Docker Scout,
  [Trivy](https://trivy.dev/), and [Grype](https://github.com/anchore/grype).
  Trivy and Grype can also run as Docker containers with no installation needed.
- `jq` (optional), for filtering the VEX file.

## Step 1: Scan without VEX

Sign in to the Docker Hardened Images registry:

```console
$ docker login dhi.io
```

Then pull the image:

```console
$ docker pull dhi.io/python:3.13 --platform linux/amd64
```

Then scan without VEX to see the raw CVE count. Docker Scout automatically
applies VEX on Docker Hardened Images and can't show this unfiltered baseline.
Use Trivy or Grype for the before/after comparison.

{{< tabs >}}
{{< tab name="Trivy" >}}

```console
$ trivy image --scanners vuln dhi.io/python:3.13
```

If Trivy isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image --scanners vuln dhi.io/python:3.13
```

Example output:

```plaintext
Total: 28 (UNKNOWN: 0, LOW: 16, MEDIUM: 8, HIGH: 4, CRITICAL: 0)
```

{{< /tab >}}
{{< tab name="Grype" >}}

```console
$ grype dhi.io/python:3.13
```

If Grype isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  anchore/grype:latest docker:dhi.io/python:3.13
```

Grype reports a similar count of CVEs across the same packages, in a different
table format.

{{< /tab >}}
{{< /tabs >}}

The output lists CVEs across `libc6`, `libncursesw6`, `libsqlite3-0`, `libuuid1`,
`zlib1g`, and others, all runtime dependencies that Python needs to function.
These packages are present by design.

A scan result of 28 doesn't mean 28 vulnerabilities require patching. It means
28 CVEs have been reported against packages present in the image. Whether any of
those CVEs are actually exploitable in this configuration is a separate
question, and that's exactly what VEX answers.

## Step 2: Fetch the VEX attestation

Export the VEX attestation to a local file:

```console
$ docker scout vex get dhi.io/python:3.13 --platform linux/amd64 --output python-vex.json
```

This fetches a signed OpenVEX document from `registry.scout.docker.com`,
Docker's supply chain metadata registry for all Docker Hardened Images. The
document records Docker's exploitability assessment for every CVE found in the
image's SBOM.

> [!NOTE]
>
> Docker Scout fetches this file automatically when scanning. You only need to
> download it explicitly for Trivy and Grype, or to run the `jq` queries in
> Steps 6 and 7.
>
> If the image exists locally on your device, prefix the image name with
> `registry://` to force Scout to look up the attestation from the registry
> rather than the local image store:
>
> ```console
> $ docker scout vex get registry://dhi.io/python:3.13 --platform linux/amd64 --output python-vex.json
> ```

## Step 3: Scan with VEX applied

{{< tabs >}}
{{< tab name="Docker Scout" >}}

Docker Scout automatically fetches and applies the VEX attestation with no local
file needed:

```console
$ docker scout cves dhi.io/python:3.13
```

Example output:

```plaintext
    ✓ SBOM obtained from attestation, 47 packages indexed
    ✓ Provenance obtained from attestation
    ✓ VEX statements obtained from attestation
    ✓ No vulnerable package detected
```

{{< /tab >}}
{{< tab name="Trivy" >}}

Pass the VEX file with the `--vex` flag:

```console
$ trivy image --scanners vuln --vex python-vex.json dhi.io/python:3.13
```

If Trivy isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/python-vex.json:/tmp/vex.json" \
  aquasec/trivy:latest image --scanners vuln --vex /tmp/vex.json dhi.io/python:3.13
```

Example output:

```plaintext
Total: 0 (UNKNOWN: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0)

Some vulnerabilities have been ignored/suppressed. Use the '--show-suppressed' flag to display them.
```

{{< /tab >}}
{{< tab name="Grype" >}}

Pass the VEX file with the `--vex` flag:

```console
$ grype dhi.io/python:3.13 --vex python-vex.json
```

If Grype isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/python-vex.json:/tmp/vex.json" \
  anchore/grype:latest docker:dhi.io/python:3.13 --vex /tmp/vex.json
```

Example output:

```plaintext
No vulnerabilities found
```

{{< /tab >}}
{{< /tabs >}}

Same image, same packages, same CVE database. The only difference is context.
The scanner matched each CVE against the VEX file and suppressed every one that
Docker assessed as not exploitable.

The packages are still there. Check the SBOM and you will see `libc6`,
`libsqlite3-0`, and every other package from Step 1. Zero CVEs does not mean
the packages were removed. It means each reported CVE has a documented reason
why it does not apply to this product configuration.

VEX is an open standard: the attestation travels with the image and any
compliant scanner reads the same reasoning. Step 5 shows how that compares with
other suppression mechanisms.

## Step 4: Inspect every suppression and its justification

The suppressed CVEs have not simply disappeared. Use `--show-suppressed` to see
them alongside the reason each one was excluded.

> [!NOTE]
>
> Docker Scout applies VEX automatically. You can use `--only-vex-affected` to
> list the CVEs that VEX suppressed, but Scout does not display the
> justification code in its output. Use Trivy or Grype to inspect the full
> audit trail with per-CVE justification codes.

{{< tabs >}}
{{< tab name="Trivy" >}}

```console
$ trivy image --scanners vuln --vex python-vex.json --show-suppressed dhi.io/python:3.13
```

If Trivy isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/python-vex.json:/tmp/vex.json" \
  aquasec/trivy:latest image --scanners vuln --vex /tmp/vex.json --show-suppressed dhi.io/python:3.13
```

Example output:

```plaintext
Suppressed Vulnerabilities (Total: 28)
======================================
┌──────────────┬──────────────────┬──────────┬──────────────┬───────────────────────────────────────────────────┐
│   Library    │  Vulnerability   │ Severity │    Status    │                     Statement                     │
├──────────────┼──────────────────┼──────────┼──────────────┼───────────────────────────────────────────────────┤
│ libc6        │ CVE-2010-4756    │ LOW      │ not_affected │ vulnerable_code_cannot_be_controlled_by_adversary │
│ libsqlite3-0 │ CVE-2025-70873   │ LOW      │ not_affected │ vulnerable_code_not_present                       │
│ ...          │ ...              │ ...      │ ...          │ ...                                               │
└──────────────┴──────────────────┴──────────┴──────────────┴───────────────────────────────────────────────────┘
```

The `Statement` column shows the machine-readable justification code from the
VEX file.

{{< /tab >}}
{{< tab name="Grype" >}}

```console
$ grype dhi.io/python:3.13 --vex python-vex.json --show-suppressed
```

If Grype isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/python-vex.json:/tmp/vex.json" \
  anchore/grype:latest docker:dhi.io/python:3.13 --vex /tmp/vex.json --show-suppressed
```

Grype displays suppressed CVEs inline in its results table, labeled
`(suppressed)`, alongside the justification code from the VEX file.

{{< /tab >}}
{{< /tabs >}}

The justification codes have precise meanings:

- `vulnerable_code_cannot_be_controlled_by_adversary`: the vulnerable code
  path exists in the package, but an attacker cannot trigger it in this
  configuration.
- `vulnerable_code_not_present`: the vulnerable code was not compiled into
  this build or is otherwise absent.
- `inline_mitigations_already_exist`: Docker has applied a backport or patch
  that addresses the CVE in this image.

For the full list of justification codes, see [VEX status
reference](/manuals/dhi/core-concepts/vex.md#not_affected-justification-codes).

Every suppression is documented, auditable, and verifiable with any VEX-enabled
scanner. Step 5 shows what this audit trail looks like compared with
scanner-specific ignore files.

## Step 5: Compare with advisory-based suppression

Scanner ignore files and distro advisory feeds can produce the same zero-result
as VEX. The difference shows up in `--show-suppressed`.

Pull `debian:bookworm-slim` (the same base image underlying many production
images, including the Python image used in earlier steps) and scan it to see
its raw CVE count:

> [!NOTE]
>
> The VEX document in this step references specific package versions. If
> `debian:bookworm-slim` has been updated since this guide was written, the
> package versions in your scan may differ and the PURL in `demo.vex.json` will
> need to be updated accordingly.
>
> To follow the guide exactly as written, pin to the digest used when this step
> was authored:
>
> ```text
> debian:bookworm-slim@sha256:f9c6a2fd2ddbc23e336b6257a5245e31f996953ef06cd13a59fa0a1df2d5c252
> ```
>
> Substitute this for `debian:bookworm-slim` in every command in this step.

```console
$ trivy image --scanners vuln debian:bookworm-slim
```

If Trivy isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image --scanners vuln debian:bookworm-slim
```

Example output:

```plaintext
Total: 134 (UNKNOWN: 2, LOW: 79, MEDIUM: 44, HIGH: 7, CRITICAL: 2)
```

Create a `.trivyignore` file to suppress three LOW-severity CVEs in `libc6`:

```text
# .trivyignore
CVE-2010-4756
CVE-2019-9192
CVE-2019-1010025
```

Scan with the ignore file applied:

```console
$ trivy image --scanners vuln --ignorefile .trivyignore --show-suppressed debian:bookworm-slim
```

If Trivy isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/.trivyignore:/tmp/.trivyignore" \
  aquasec/trivy:latest image --scanners vuln \
  --ignorefile /tmp/.trivyignore --show-suppressed debian:bookworm-slim
```

Example output:

```plaintext
Total: 128 (UNKNOWN: 2, LOW: 73, MEDIUM: 44, HIGH: 7, CRITICAL: 2)

Suppressed Vulnerabilities (Total: 6)
=====================================
┌──────────┬──────────────────┬──────────┬─────────┬───────────┬──────────────┐
│ Library  │  Vulnerability   │ Severity │ Status  │ Statement │    Source    │
├──────────┼──────────────────┼──────────┼─────────┼───────────┼──────────────┤
│ libc-bin │ CVE-2010-4756    │ LOW      │ ignored │ N/A       │ .trivyignore │
│          ├──────────────────┤          │         │           │              │
│          │ CVE-2019-1010025 │          │         │           │              │
│          ├──────────────────┤          │         │           │              │
│          │ CVE-2019-9192    │          │         │           │              │
├──────────┼──────────────────┤          │         │           │              │
│ libc6    │ CVE-2010-4756    │          │         │           │              │
│          ├──────────────────┤          │         │           │              │
│          │ CVE-2019-1010025 │          │         │           │              │
│          ├──────────────────┤          │         │           │              │
│          │ CVE-2019-9192    │          │         │           │              │
└──────────┴──────────────────┴──────────┴─────────┴───────────┴──────────────┘
```

The `Statement` column is `N/A`. The scanner suppressed the CVEs and recorded
the source file, but not why they don't apply.

Now create `demo.vex.json` with a justification code and human-readable
reasoning for each CVE:

```json
{
  "@context": "https://openvex.dev/ns/v0.2.0",
  "@id": "https://example.com/vex/demo-libc-1",
  "author": "demo",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": 1,
  "statements": [
    {
      "vulnerability": {"name": "CVE-2010-4756"},
      "products": [
        {"@id": "pkg:deb/debian/libc6@2.36-9+deb12u13"},
        {"@id": "pkg:deb/debian/libc-bin@2.36-9+deb12u13"}
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_cannot_be_controlled_by_adversary",
      "status_notes": "The glob function requires caller-controlled input with no depth limit. This container does not expose glob to external input."
    },
    {
      "vulnerability": {"name": "CVE-2019-9192"},
      "products": [
        {"@id": "pkg:deb/debian/libc6@2.36-9+deb12u13"},
        {"@id": "pkg:deb/debian/libc-bin@2.36-9+deb12u13"}
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_cannot_be_controlled_by_adversary",
      "status_notes": "Requires crafted regex input with specific backtracking patterns. The application does not pass externally supplied strings to regcomp."
    },
    {
      "vulnerability": {"name": "CVE-2019-1010025"},
      "products": [
        {"@id": "pkg:deb/debian/libc6@2.36-9+deb12u13"},
        {"@id": "pkg:deb/debian/libc-bin@2.36-9+deb12u13"}
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_not_in_execute_path",
      "status_notes": "ASLR address disclosure requires local process execution and /proc access. This container runs without host process namespace access."
    }
  ]
}
```

> [!NOTE]
>
> The version `2.36-9+deb12u13` in the product PURLs must match the `libc6`
> version in the image you scanned. Run `docker scout sbom debian:bookworm-slim
> --format list` and look for `libc6` if your scan reports a different version.

Scan with the VEX document:

```console
$ trivy image --scanners vuln --vex demo.vex.json --show-suppressed debian:bookworm-slim
```

If Trivy isn't installed, run it in a container:

```console
$ docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/demo.vex.json:/tmp/demo.vex.json" \
  aquasec/trivy:latest image --scanners vuln \
  --vex /tmp/demo.vex.json --show-suppressed debian:bookworm-slim
```

Example output:

```plaintext
Total: 128 (UNKNOWN: 2, LOW: 73, MEDIUM: 44, HIGH: 7, CRITICAL: 2)

Suppressed Vulnerabilities (Total: 6)
=====================================
┌──────────┬──────────────────┬──────────┬──────────────┬───────────────────────────────────────────────────┬───────────────┐
│ Library  │  Vulnerability   │ Severity │    Status    │                     Statement                     │    Source     │
├──────────┼──────────────────┼──────────┼──────────────┼───────────────────────────────────────────────────┼───────────────┤
│ libc-bin │ CVE-2010-4756    │ LOW      │ not_affected │ vulnerable_code_cannot_be_controlled_by_adversary │ demo.vex.json │
│          ├──────────────────┤          │              ├───────────────────────────────────────────────────┤               │
│          │ CVE-2019-1010025 │          │              │ vulnerable_code_not_in_execute_path               │               │
│          ├──────────────────┤          │              ├───────────────────────────────────────────────────┤               │
│          │ CVE-2019-9192    │          │              │ vulnerable_code_cannot_be_controlled_by_adversary │               │
├──────────┼──────────────────┤          │              │                                                   │               │
│ libc6    │ CVE-2010-4756    │          │              │                                                   │               │
│          ├──────────────────┤          │              ├───────────────────────────────────────────────────┤               │
│          │ CVE-2019-1010025 │          │              │ vulnerable_code_not_in_execute_path               │               │
│          ├──────────────────┤          │              ├───────────────────────────────────────────────────┤               │
│          │ CVE-2019-9192    │          │              │ vulnerable_code_cannot_be_controlled_by_adversary │               │
└──────────┴──────────────────┴──────────┴──────────────┴───────────────────────────────────────────────────┴───────────────┘
```

The same six CVEs are suppressed. The `Status` column now shows `not_affected`
instead of `ignored`, and the `Statement` column contains an OpenVEX
justification code for each one.

| Property           | `.trivyignore`     | VEX                               | What this means for `.trivyignore`                                 |
|--------------------|--------------------|-----------------------------------|--------------------------------------------------------------------|
| Statement column   | N/A                | Justification code per CVE        | Like advisory feeds: no record of why the CVE doesn't apply        |
| Works in Grype     | No. CVEs reappear. | Yes. Pass `--vex demo.vex.json`.  | Like advisory feeds: suppression is tied to one scanner's database |
| Travels with image | No. Local file.    | Yes. Attached as OCI attestation. | Like advisory feeds: results can change without an image change    |

Distro-level advisory feeds work like `.trivyignore` at a larger scale: a CVE
gets marked `not_affected` in the distro database, and the next time the scanner
updates its vulnerability DB, that CVE disappears from results without any
record of the reasoning. The VEX document attached to Docker Hardened Images
contains that reasoning explicitly, scoped to the exact package version and
product configuration it applies to.

## Step 6: Read Docker's reasoning for a specific CVE

The justification codes are machine-readable; the `status_notes` field in the
VEX file contains Docker's human-readable reasoning. Use `jq` to look up a
specific CVE:

```console
$ jq '.statements[] | select(.vulnerability.name == "CVE-2010-4756") | {status, justification, status_notes}' python-vex.json
```

Example output:

```json
{
  "status": "not_affected",
  "justification": "vulnerable_code_cannot_be_controlled_by_adversary",
  "status_notes": "Standard POSIX behavior in glibc. Applications using glob need to impose limits themselves. Requires authenticated access and is considered unimportant by Debian."
}
```

The `status_notes` field explains Docker's reasoning in plain language. For
CVE-2010-4756, the glob behavior described by the CVE is standard POSIX
behavior, requires authenticated access, and is classified as unimportant by
the Debian security team.

Each statement also lists the affected products as Package URLs (PURLs), for
example `pkg:deb/debian/glibc@2.41-12%2Bdeb13u2?os_distro=trixie&os_name=debian&os_version=13`.
Trivy matched this statement to `libc6` in the image's SBOM by comparing that
PURL against the packages recorded in the SBOM.

> [!IMPORTANT]
>
> **PURL matching is strict.** Scanners must match VEX statements to packages
> using the full PURL string, including the `os_name`, `os_version`, and
> `os_distro` qualifiers. Matching on package name alone risks applying a
> suppression from one OS version to a different version where the CVE *is*
> exploitable.

## Step 7: Filter VEX statements by status

Once you have `python-vex.json`, use `jq` to query it directly.

Count statements by status:

```console
$ jq '[.statements[].status] | group_by(.) | map({status: .[0], count: length})' python-vex.json
```

List all CVEs under active investigation:

```console
$ jq '[.statements[] | select(.status == "under_investigation") | {cve: .vulnerability.name, products: [.products[]."@id"]}]' python-vex.json
```

List any CVEs with `affected` status:

```console
$ jq '[.statements[] | select(.status == "affected") | {cve: .vulnerability.name, action: .action_statement}]' python-vex.json
```

The `affected` query returns an empty array for the current `dhi.io/python:3.13`
image, which is the expected result for an actively maintained tag. To see `affected`
entries across all DHI Python versions, query the full VEX feed:

```console
$ curl -s https://raw.githubusercontent.com/docker-hardened-images/advisories/main/vex/python/dhi-python.vex.json \
  | jq '[.statements[] | select(.status == "affected") | {cve: .vulnerability.name, action: .action_statement}]'
```

For status definitions and justification codes, see the [VEX status
reference](/manuals/dhi/core-concepts/vex.md#vex-status-reference).

## What's next

- **Scan with other tools:** Learn how to apply DHI VEX statements with Trivy
  (VEX Hub) and Grype in [Scan Docker Hardened
  Images](/manuals/dhi/how-to/scan.md).
- **Write your own VEX for child images:** If you build on top of a DHI and
  want to suppress CVEs in packages you add, see [Create an exception using
  VEX](/manuals/scout/how-tos/create-exceptions-vex.md).
- **VEX status reference:** For status definitions, justification codes, and
  why DHI does not use `fixed`, see [Vulnerability Exploitability eXchange
  (VEX)](/manuals/dhi/core-concepts/vex.md#vex-status-reference).
- **Browse the VEX feed directly:** The raw VEX data is published at
  [github.com/docker-hardened-images/advisories](https://github.com/docker-hardened-images/advisories/tree/main/vex),
  organized by image name.
