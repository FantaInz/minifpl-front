export const paths = {
    home: {
      path: '/',
      getHref: () => '/',
    },
    auth: {
      main: {
        path: '/auth',
        getHref: () => '/auth',
      },
    },
    app: {
      root: {
        path: '/app',
        getHref: () => '/app',
      },
      solver: {
        path: '/app/solver',
        getHref: () => '/app/solver',
      },
      plans: {
        path: '/app/plans',
        getHref: () => '/app/plans',
      },
      predictions: {
        path: '/app/predictions',
        getHref: () => '/app/predictions',
      },
      userPanel: {
        path: '/app/user-panel',
        getHref: () => '/app/user-panel',
      },
    },
  };
  