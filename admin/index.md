---
description: Learn about Docker Admin.
keywords: docker admin, admin
title: Docker Admin overview
---
{% include admin-early-access.md %}

Docker Admin provides administrators with centralized observability, access management, and controls for their company and organizations. To provide these features, Docker uses the following hierarchy and roles:

![Docker hierarchy](./images/docker-hierarchy.svg){: width="800px" }


- Company: A company simplifies the management of Docker organizations and settings. Creating a company is optional and only available to Docker Business subscribers.
  - Company owner: A company can have up to 10 owners. Company owners have company-wide observability and can manage company-wide settings that apply to all nested organizations. In addition, company owners have the same access as organization owners for all nested organizations.
- Organization: An organization is a collection of teams and repositories. Docker Team and Business subscribers must have at least one organization.
  - Organization owner: An organization can have multiple owners that are members of the owners team. Organization owners have observability into their and can manage organization users and settings.
- Team: A team is a group of Docker members that belong to an organization. An organization has one team upon creation, the owners team. Organization and company owners can group members into additional teams to configure repository permissions on a per-team basis.
  - Member: A member is a Docker user that's a member of at least one team in an organization.


## Company administration

Learn how to use Docker Admin to manage your company in the following topics:

- [Company overview](./company/index.md)
- [Manage company owners](./company/owners.md)
- [Manage company users](./company/users.md)
- [Manage organizations](./company/organizations.md)
- [Manage settings](./company/settings.md)
- [Frequently asked questions](./company/faqs.md)

## Organization administration

Learn how to use Docker Admin to manage your organization in the following topics:

- [Organization overview](./organization/index.md)
- [Manage organization users](./organization/users.md)
- [Audit activity logs](./organization/activity-logs.md)
- [Manage image access](./organization/image-access.md)
- [Manage registry access](./organization/registry-access.md)
- [Manage settings](./organization/settings.md)
- [Frequently asked questions](./organization/faqs.md)

## Account administration

Learn how to use Docker Admin to [manage your account](./account/index.md).
