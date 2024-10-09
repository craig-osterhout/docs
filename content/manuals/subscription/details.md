---
title: Docker subscriptions and features
linkTitle: Subscriptions and features
description: Learn about Docker subscription tiers and their features
keywords: subscription, personal, pro, team, business, features, docker subscription
aliases:
- /subscription/core-subscription/details/
weight: 10
---

You can do more with Docker with a Docker subscription, such as add collaborators, create scoped access tokens, and create private repositories. This page provides an overview of each subscription tier. To compare features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

Legacy subscriptions apply to Docker subscribers who last purchased or renewed their subscription before November 15th, 2024. These subscribers will keep their current plan and pricing until their next renewal date that falls after November 15, 2024. For more details, see [Announcing Upgraded Docker Plans](https://www.docker.com/blog/november-2024-updated-plans-announcement/).

The following section describes some of the key features included with your Docker subscription.

Docker maintains a [public roadmap](https://github.com/docker/roadmap) so subscribers can see what new features are in development, as well as request new capabilities.

{{< tabs >}}

{{< tab name="Subscriptions" >}}

## Docker Personal

**Docker Personal** (formerly Docker Free) is ideal for open-source communities, individual developers, education, and small businesses, and includes the free use of Docker components including Docker Desktop and Docker Hub.

Docker Personal includes:

- 1 included repository with continuous vulnerability analysis in Docker Scout.
- Unlimited public Docker Hub repositories.
- 1 private Docker Hub repository with 2GB storage.
- 40 pulls/hr Docker Hub image pull rate limit.

Additionally, unauthenticated users get 10 pulls per hour per IP address.

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

## Docker Pro

**Docker Pro** enables individual developers to get more control of their development environment and provides an integrated and reliable developer experience. It reduces the amount of time developers spend on mundane and repetitive tasks and empowers developers to spend more time creating value for their customers.

Docker Pro includes:

- 200 Docker Build Cloud minutes per month.
- 2 included repositories with continuous vulnerability analysis in Docker Scout.
- 100 Testcontainers Cloud runtime minutes for use either in Docker Desktop or for CI.
- No Docker Hub image pull rate limits.
- 25K Docker Hub pulls per month are included.

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

## Docker Team

**Docker Team** offers capabilities for collaboration, productivity, and security across organizations. It enables groups of developers to unlock the full power of collaboration and sharing combined with essential security features and team management capabilities. A Docker Team subscription includes licensing for commercial use of Docker components including Docker Desktop and Docker Hub.

Docker Team includes:

- 500 Docker Build Cloud minutes per month.
- Unlimited Docker Scout repositories with continuous vulnerability analysis.
- 500 Testcontainers Cloud runtime minutes for use either in Docker Desktop or for CI.
- No Docker Hub image pull rate limits.
- 100K Docker Hub pulls per month.

There are also advanced collaboration and management tools, including organization and team management with [Role Based Access Control (RBAC)](/security/for-admins/roles-and-permissions/), [activity logs](/admin/organization/activity-logs/), and more.

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

## Docker Business

**Docker Business** offers centralized management and advanced security features for enterprises that use Docker at scale. It empowers leaders to manage their Docker development environments and speed up their secure software supply chain initiatives. A Docker Business subscription includes licensing for commercial use of Docker components including Docker Desktop and Docker Hub.

Docker Business includes:
- 1500 Docker Build Cloud minutes per month.
- Unlimited Docker Scout repositories with continuous vulnerability analysis.
- 1500 Testcontainers Cloud runtime minutes for use either in Docker Desktop or for CI.
- No Docker Hub image pull rate limits.
- 1M Docker Hub pulls per month.

In addition, you gain access to enterprise-grade features, such as:
- [Hardened Docker Desktop](../security/for-admins/hardened-desktop/_index.md)
- [Image Access Management](../security/for-admins/hardened-desktop/image-access-management.md) which lets admins control what content developers can access
- [Registry Access Management](../security/for-admins/hardened-desktop/registry-access-management.md) which lets admins control what registries developers can access
- [Company layer](/admin/company/) to manage multiple organizations and settings
- [Single sign-on](/security/for-admins/single-sign-on/)
- [System for Cross-domain Identity Management](/security/for-admins/provisioning/scim/)

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

### Self-serve

A self-serve Docker Business subscription is where everything is set up by you. You can:

- Manage your own invoices
- Add or remove seats
- Update billing and payment information
- Downgrade your subscription at any time

### Sales-assisted

A sales-assisted Docker Business subscription where everything is set up and managed by a dedicated Docker account manager.

{{< /tab >}}
{{< tab name="Legacy subscriptions" >}}

> [!IMPORTANT]
>
> As of November 15th, 2024, Docker Core, Docker Build Cloud, and Docker Scout
> subscriptions are no longer available and have been replaced by subscriptions
> that provide access to all tools. If you subscribed or renewed your
> subscriptions before November 15th, 2024, your legacy Docker subscriptions
> still apply to your account until you renew.


The following describes some of the key features included with your legacy Docker Core, Docker Build Cloud, and Docker Scout subscriptions:

![Docker Core subscription diagram](./images/subscription-diagram.webp)

3 Docker Scout-enabled repositories for advanced remote image analysis. For more details, see [Docker Scout subscriptions](#docker-scout-subscriptions).

Docker Build Cloud minutes are also included. For more details, see [Docker Build Cloud subscriptions](#docker-build-cloud-subscriptions).

## Legacy Docker Core subscriptions

### Docker Pro

**Docker Pro** enables individual developers to get more control of their development environment and provides an integrated and reliable developer experience. It reduces the amount of time developers spend on mundane and repetitive tasks and empowers developers to spend more time creating value for their customers.

Docker Pro includes:
- Unlimited public repositories
- Unlimited [Scoped Access Tokens](/security/for-developers/access-tokens/)
- Unlimited [collaborators](/docker-hub/repos/access/#collaborators-and-their-role) for public repositories at no cost per month.
- Access to [Docker Scout Free](#docker-scout-free) to get started with software supply chain security.
- Unlimited private repositories
- 5000 image [pulls per day](/docker-hub/download-rate-limit/)
- [Auto Builds](/docker-hub/builds/) with 5 concurrent builds
- 300 [Vulnerability Scans](/docker-hub/vulnerability-scanning/)

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

### Docker Team

**Docker Team** offers capabilities for collaboration, productivity, and security across organizations. It enables groups of developers to unlock the full power of collaboration and sharing combined with essential security features and team management capabilities. A Docker Team subscription includes licensing for commercial use of Docker components including Docker Desktop and Docker Hub.

Docker Team includes:
- Everything included in Docker Pro
- Unlimited teams
- [Auto Builds](/docker-hub/builds/) with 15 concurrent builds
- Unlimited [Vulnerability Scanning](/docker-hub/vulnerability-scanning/)
- 5000 image [pulls per day](/docker-hub/download-rate-limit/) for each team member

There are also advanced collaboration and management tools, including organization and team management with [Role Based Access Control (RBAC)](/security/for-admins/roles-and-permissions/), [activity logs](/admin/organization/activity-logs/), and more.

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

### Docker Business

**Docker Business** offers centralized management and advanced security features for enterprises that use Docker at scale. It empowers leaders to manage their Docker development environments and speed up their secure software supply chain initiatives. A Docker Business subscription includes licensing for commercial use of Docker components including Docker Desktop and Docker Hub.

Docker Business includes:
- Everything included in Docker Team
- [Hardened Docker Desktop](../security/for-admins/hardened-desktop/_index.md)
- [Image Access Management](../security/for-admins/hardened-desktop/image-access-management.md) which lets admins control what content developers can access
- [Registry Access Management](../security/for-admins/hardened-desktop/registry-access-management.md) which lets admins control what registries developers can access
- [Company layer](/admin/company/) to manage multiple organizations and settings
- [Single Sign-On](/security/for-admins/single-sign-on/)
- [System for Cross-domain Identity Management](/security/for-admins/provisioning/scim/) and more.

For a list of features available in each tier, see [Docker Pricing](https://www.docker.com/pricing/).

#### Self-serve

A self-serve Docker Business subscription is where everything is set up by you. You can:

- Manage your own invoices
- Add or remove seats
- Update billing and payment information
- Downgrade your subscription at any time

#### Sales-assisted

A sales-assisted Docker Business subscription where everything is set up and managed by a dedicated Docker account manager.

## Docker Scout subscriptions

This section provides an overview of the legacy subscription plans for Docker Scout. To compare features available for each plan, see [Docker Scout Pricing](https://docker.com/products/docker-scout).

### Docker Scout Free

Docker Scout Free is available for organizations. If you have a Docker Core subscription, you automatically have access to Docker Scout Free.

Docker Scout Free includes:

- Unlimited local image analysis
- Up to 3 Docker Scout-enabled repositories
- SDLC integration, including policy evaluation and workload integration
- On-prem and cloud container registry integrations
- Security posture reporting

### Docker Scout Team

Docker Scout Team includes:

- All the features available in Docker Scout Free
- In addition to 3 Docker Scout-enabled repositories, add up to 100 repositories when you buy your subscription

To learn more about pricing per repository, see [Docker Scout Pricing](https://www.docker.com/products/docker-scout/).

### Docker Scout Business

Docker Scout Business includes:

- All the features available in Docker Scout Team
- Unlimited Docker Scout-enabled repositories

## Docker Build Cloud subscriptions

 This page describes the features available for the different legacy Docker Build Cloud subscription tiers. To compare features available for each tier, see [Docker Build Cloud pricing](https://www.docker.com/products/build-cloud/#pricing).

### Docker Build Cloud Starter

If you have an existing [Docker Core subscription](/subscription/details/), a base level of Build Cloud minutes and cache are included. The features available vary depending on your Docker Core subscription tier.

#### Docker Pro

- 100 build minutes every month
- Available for one user
- 4 parallel builds

#### Docker Team

- 400 build minutes every month shared across your organization
- Option to onboard up to 100 members
- Can buy additional seats to add more minutes

#### Docker Business

- All the features listed for Docker Team
- 800 build minutes every month shared across your organization

### Docker Build Cloud Team

Docker Build Cloud Team offers the the following features:

- 200 additional build minutes per seat
- Option to buy reserve minutes
- Increased shared cache

The Docker Build Cloud Team subscription is tied to a Docker
[organization](/admin/organization/). To use the build minutes or
shared cache of a Docker Build Cloud Team subscription, users must be a part of
the organization associated with the subscription. See Manage seats and invites.

### Docker Build Cloud Enterprise

For more details about your enterprise subscription, [contact sales](https://www.docker.com/products/build-cloud/#contact_sales).

{{< /tab >}}
{{< /tabs >}}


## Support for subscriptions

All Docker Pro, Team, and Business subscribers receive email support for their subscriptions. Additional premium support is available for Docker Business customers. [Contact sales](https://www.docker.com/pricing/contact-sales/) for more information about premium support programs.
