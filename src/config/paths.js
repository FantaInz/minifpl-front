export const paths = {
  auth: {
    main: {
      path: "/auth",
      getHref: () => "/auth",
    },
  },
  app: {
    root: {
      path: "/",
      getHref: () => "/",
    },
    solver: {
      path: "/solver",
      getHref: () => "/solver",
    },
    plans: {
      path: "/plans",
      getHref: () => "/plans",
    },
    predictions: {
      path: "/predictions",
      getHref: () => "/predictions",
    },
  },
};
