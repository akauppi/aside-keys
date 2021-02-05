# About Google Identity Platform

Google Identity Platform and Firebase have a special relation. You can see GIdP as a superset of Firebase; they share the authentication API, JavaScript client and project identifiers. When you create a Google Identity Platform project, it automatically creates also a Firebase project, by the same id.

## The application

The auth values (API key and auth domain) needed by the `aside-keys` tag are not secret - but not quite public, either. They identify a web "application" for GIdP / Firebase which means:

- description of your application so that people authenticating know who is asking for their identity
- other details regarding legal frameworks, e.g. GDPR

You'll end up filling such information when filing for an application, either via the GIdP or Firebase console. We won't go into the details here - just helping you see the connection. 🙂

## Auth values - Firebase point of view

Firebase recommends not storing the API key and auth domain in version control, but is otherwise relaxed about them. It seems there's less powers for those when created as part of the Firebase workflow.

## Auth values - Google Identity Platform point of view

Here, there are more strong words and Google recommends (well, insists!) that you  restrict the powers of the API key, when using it for identification.

You do it by:

1. Google Cloud console > `APIs & Services` > `Credentials` > `API Keys` > `Browser key (auto created by Firebase)` (click)
2. `API Restrictions` > `Restrict key` > `[x] Identity Toolkit API`

<!-- Is this an earlier way? (no longer visible):
1. Google Cloud console > `APIs & Services` > `Credentials`
2. `Application restrictions` > `⦿ HTTP refererrers`
3. `Website restrictions` > 
-->

This should make the icon green, indicating all is well:

![](.images/all-is-well.png)

## Costs

Use of identity platform is free (as of Jan 2021) up to 49 999 monthly active users. 😊
