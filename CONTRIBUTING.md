# Contributing

## Development

### Requirements

- Node.js
- Yarn

To install Yarn on a cluster computer I suggest you follow [this guide](https://github.com/sindresorhus/guides/blob/main/npm-global-without-sudo.md) or install it with [Homebrew](https://brew.sh).

### Preparing the environment

1. Fork this repository.
2. Clone your fork to your computer.
3. [Create an app](https://profile.intra.42.fr/oauth/applications/new) on the intranet, so you get [42 API](https://api.intra.42.fr) access.
	- In the section **Redirect URI** enter `http://localhost:3000`.
	- In the section **Scopes** flag the `projects` (*Manage teams, slots and all projects related stuff*) and `profile` (*Manage user data*) scopes.
4. Create a `.env.local` file in the root of the repository with the following variables, substituting with the right values.

```
FT_UID=[paste from intra]
FT_SECRET=[paste from intra]
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=[generate a long random string]
```

5. Run `yarn` in the root of the repository to install the project dependencies.

### Starting the development server

1. Run `yarn dev` in the root of the repository.
2. The command you just ran should say where the server is listening at, usually it's http://localhost:3000.

You can now start modifying the source files and see the results directly in the browser without refreshing the page.
