export {};

// Control-Room Wall, Level 1: independent state lanes
// Goal: model navigation, request progress, and panel motion as separate lanes.

type NavigationState =
  | { view: 'overview' }
  | { view: 'device'; deviceId: string };

type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'refreshing' };

type AnimationState =
  | { panel: 'hidden' }
  | { panel: 'entering' }
  | { panel: 'settled' }
  | { panel: 'leaving' };

type DashboardState = {
  navigation: NavigationState;
  request: RequestState;
  animation: AnimationState;
};

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type NavigationCheck = Expect<
  Equal<
    NavigationState,
    | { view: 'overview' }
    | { view: 'device'; deviceId: string }
  >
>;

type RequestCheck = Expect<
  Equal<
    RequestState,
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ready' }
    | { status: 'refreshing' }
  >
>;

type AnimationCheck = Expect<
  Equal<
    AnimationState,
    | { panel: 'hidden' }
    | { panel: 'entering' }
    | { panel: 'settled' }
    | { panel: 'leaving' }
  >
>;

type DashboardCheck = Expect<
  Equal<
    DashboardState,
    {
      navigation: NavigationState;
      request: RequestState;
      animation: AnimationState;
    }
  >
>;
