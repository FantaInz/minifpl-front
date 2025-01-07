import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import React from "react";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/lib/auth";

import AppLayout from "@/features/navbar/app-layout";
import AuthPage from "@/app/routes/auth/auth-page";
import SolverPage from "@/app/routes/app/solver";
import PlansPage from "@/app/routes/app/plans";
import PredictionsPage from "@/app/routes/app/predictions";
import NotFoundPage from "@/app/routes/not-found";

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.auth.main.path,
      element: <AuthPage />,
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={paths.app.solver.path} replace />,
        },
        {
          path: paths.app.solver.path,
          element: <SolverPage />,
        },
        {
          path: paths.app.plans.path,
          element: <PlansPage />,
        },
        {
          path: paths.app.predictions.path,
          element: <PredictionsPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
