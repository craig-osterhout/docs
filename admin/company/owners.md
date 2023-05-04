---
description: Manage company owners
keywords: company, company owners, owners, admin, docker admin
title: Manage company owners
---
{% include admin-early-access.md %}

A company can have up to 10 owners. Company owners can manage a company and its nested organizations without occupying a purchased seat.

The company owner role has permissions to do the following:

- View and manage all nested organizations and configure settings centrally.
- Control access to the company and company settings.
- Configure SSO and SCIM for all nested organizations.
- Enforce SSO log-in for all users in the company.

To perform any of the following tasks, you must be a company owner.

## View all company owners

To view all company owners, sign in to [Docker Admin](https://admin.docker.com) and navigate to **Organizations** > **Overview**.

## Add a company owner

The user that you want to add as a company owner must already have a Docker account. For details about creating a Docker account, see [Create an account](../../docker-id/index.md).

1. Sign in to [Docker Admin](https://admin.docker.com) and navigate to **Organizations** > **Overview**.
2. Select **Add Owner**.
3. Specify the user's Docker ID to search for the user.
4. After you find the user, select **Add Company Owner**.

## Remove a company owner

1. Sign in to [Docker Admin](https://admin.docker.com) and navigate to **Organizations** > **Overview**.
2. Select the **Action** icon in the row of the company owner that your want to remove.
3. Select **Remove as Company Owner**.