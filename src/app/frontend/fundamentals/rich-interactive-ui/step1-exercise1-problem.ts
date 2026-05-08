export {};

// Control-Room Wall, Level 1: independent state lanes
// Goal: model navigation, request progress, and panel motion as separate lanes.

type NavigationState = never;
type RequestState = never;
type AnimationState = never;

// TODO: Build DashboardState as an object with:
// - navigation: NavigationState
// - request: RequestState
// - animation: AnimationState
type DashboardState = never;

// Hover these while solving:
// - NavigationState should distinguish overview from one selected device.
// - RequestState should distinguish idle/loading/ready/refreshing.
// - AnimationState should distinguish hidden/entering/settled/leaving.
// - DashboardState should compose the three lanes instead of inventing a mega-status string.
