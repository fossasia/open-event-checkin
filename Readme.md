# Open Event Check-In

[![Netlify Status](https://api.netlify.com/api/v1/badges/7456234f-3254-4395-8cd8-67979322e555/deploy-status)](https://app.netlify.com/sites/open-event-checkin/deploys)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3583a71b83d94d388e1d8dd087f2b861)](https://app.codacy.com/gh/fossasia/open-event-checkin/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-ff006f.svg?style=flat-square)](https://gitter.im/fossasia/open-event-frontend)
[![Mailing](https://img.shields.io/badge/Mailing-List-red.svg)](https://groups.google.com/forum/#!forum/open-event)
[![Twitter Follow](https://img.shields.io/twitter/follow/eventyay.svg?style=social&label=Follow&maxAge=2592000?style=flat-square)](https://twitter.com/eventyay)

## Communication

Please join our [Mailing list](https://groups.google.com/forum/#!forum/open-event) or [chat channel](https://gitter.im/fossasia/open-event-frontend) to get in touch with the developers.

## Installation

Easily deployed on a variety of platforms. Detailed platform specific instructions have been provided below.
### Local
Clone or Fork the codebase and following instructions [below](https://github.com/fossasia/open-event-checkin#running--development)

### Github Pages (using Github Actions)
Refer to the [workflow](https://github.com/fossasia/open-event-checkin/tree/development/.github/workflows) for deployment

## Running / Development

After cloning the codebase, install packages:
```sh
npm i
```

Running:

```sh
npm run dev
```
Visit your app at [http://localhost:8080](http://localhost:8080).

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Format code with [Prettier](https://prettier.io/)

```sh
npm run format
```

### Running Tests (WIP)

Unit Tests with [Vitest](https://vitest.dev/)
```sh
npm run test:unit
```

End-to-End Tests with [Cypress](https://www.cypress.io/)
```sh
npm run test:e2e:dev
```

### Building for Production

```sh
npm build
```

## Deployments and Releases

### Deployments

**Master branch**

Deployed in a production environment at [https://checkin.eventyay.com](https://checkin-eventyay.com)
It consumes the API exposed by master branch deployment of open event server, hosted at [https://api.eventyay.com](https://api.eventyay.com)

#### Development branch

Only deployed locally with `npm run dev` or Netlify version when you make a pull request
It consumes the API exposed by development branch of open event server, hosted at [https://test-api.eventyay.com](https://test-api.eventyay.com)

## Further Reading / Useful Links

  - [Vue.js](https://vuejs.org/)

  - [Vue Router](https://router.vuejs.org/)

  - [Pinia](https://pinia.vuejs.org/)
  
  - [Tailwind CSS](https://tailwindcss.com/)

  - [Headless UI](https://headlessui.com/)

  - [heroicons](https://heroicons.com/)

  - [Vue Devtools for browsers](https://devtools.vuejs.org/guide/installation.html)


## Contributions Best Practices

### Commits

  - Write clear meaningful git commit messages (Do read [https://chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/))
  - Make sure your PR's description contains GitHub's special keyword references that automatically close the related issue when the PR is merged. (More info at [https://github.com/blog/1506-closing-issues-via-pull-requests](https://github.com/blog/1506-closing-issues-via-pull-requests) )
  - When you make very minor changes to a PR of yours (like for example fixing a failing Travis build or some small style corrections or minor changes requested by reviewers) make sure you squash your commits afterward so that you don't have an absurd number of commits for a very small fix. (Learn how to squash at [https://davidwalsh.name/squash-commits-git](https://davidwalsh.name/squash-commits-git) )
  - When you're submitting a PR for a UI-related issue, it would be really awesome if you add a screenshot of your change or a link to a deployment where it can be tested out along with your PR. It makes it very easy for the reviewers and you'll also get reviews quicker.

### Feature Requests and Bug Reports

When you file a feature request or when you are submitting a bug report to the [issue tracker](https://github.com/fossasia/open-event-checkin/issues), make sure you add steps to reproduce it.

### Join the development

  - Before you join development, please set up the project on your local machine, run it and go through the application completely.
  - If you would like to work on an issue, drop in a comment with the estimated completion date at the issue. If it is already assigned to someone, but there is no sign of any work being done, please feel free to drop in a comment.

## License

This project is currently licensed under the [Apache License version 2.0](LICENSE).

To obtain the software under a different license, Please contact **[FOSSASIA](https://blog.fossasia.org/contact/)**.
