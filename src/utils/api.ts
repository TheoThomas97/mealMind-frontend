import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL as string;

// ---- token helpers ----
export const getAccess = () => localStorage.getItem("access");
export const getRefresh = () => localStorage.getItem("refresh");
export const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};
export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// base query that sends Authorization header
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL + "/",
  prepareHeaders: (headers) => {
    const token = getAccess();
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// wrapper that tries refresh when a request returns 401
const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extra) => {
  let result = await rawBaseQuery(args, api, extra);

  if (result.error && (result.error as any).status === 401) {
    const refresh = getRefresh();
    if (refresh) {
      const refreshResult = await rawBaseQuery(
        { url: "auth/token/refresh/", method: "POST", body: { refresh } },
        api,
        extra
      );
      if (!refreshResult.error) {
        const newAccess = (refreshResult.data as any).access as string;
        setTokens(newAccess); // keep old refresh token
        result = await rawBaseQuery(args, api, extra); // retry original
      } else {
        clearTokens(); // refresh failed → log out locally
      }
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Recipe", "Ingredient", "MealPlan", "ShoppingList"],
  endpoints: (build) => ({
    // --- AUTH ---
    login: build.mutation<{ access: string; refresh: string }, { username: string; password: string }>({
      query: (body) => ({ url: "auth/token/", method: "POST", body }),
    }),

    // --- RECIPES ---
    getRecipes: build.query<any, void>({ query: () => "recipes/", providesTags: ["Recipe"] }),
    getRecipe: build.query<any, number>({ query: (id) => `recipes/${id}/` }),
    createRecipe: build.mutation<any, Partial<any>>({
      query: (body) => ({ url: "recipes/", method: "POST", body }),
      invalidatesTags: ["Recipe"],
    }),
    updateRecipe: build.mutation<any, { id: number; patch: Partial<any> }>({
      query: ({ id, patch }) => ({
      url: `recipes/${id}/`,
      method: "PATCH",
      body: patch,
    }),
      invalidatesTags: ["Recipe"],
    }),
    deleteRecipe: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `recipes/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Recipe"],
    }),


    // --- INGREDIENTS ---
    getIngredients: build.query<any, void>({ query: () => "ingredients/", providesTags: ["Ingredient"] }),
    createIngredient: build.mutation<any, { name: string; unit?: string }>({
      query: (body) => ({ url: "ingredients/", method: "POST", body }),
      invalidatesTags: ["Ingredient"],
    }),
    createRecipeIngredient: build.mutation<
      any,
      { recipe: number; ingredient: number; quantity?: number; unit?: string }
    >({
      query: (body) => ({ url: "recipe-ingredients/", method: "POST", body }),
      invalidatesTags: ["Recipe"],
    }),
    deleteRecipeIngredient: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `recipe-ingredients/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Recipe"],
    }),
    




    // --- MEAL PLANS ---
    getMealPlans: build.query<any, void>({ query: () => "meal-plans/", providesTags: ["MealPlan"] }),
    createMealPlan: build.mutation<any, Partial<any>>({
      query: (body) => ({ url: "meal-plans/", method: "POST", body }),
      invalidatesTags: ["MealPlan"],
    }),

    // --- SHOPPING LISTS ---
    getShoppingLists: build.query<any, void>({ query: () => "shopping-lists/", providesTags: ["ShoppingList"] }),
    createShoppingList: build.mutation<any, Partial<any>>({
      query: (body) => ({ url: "shopping-lists/", method: "POST", body }),
      invalidatesTags: ["ShoppingList"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetIngredientsQuery,
  useCreateIngredientMutation,        
  useCreateRecipeIngredientMutation,  
  useDeleteRecipeIngredientMutation,  
  useGetMealPlansQuery,
  useCreateMealPlanMutation,
  useGetShoppingListsQuery,
  useCreateShoppingListMutation,
} = api;

