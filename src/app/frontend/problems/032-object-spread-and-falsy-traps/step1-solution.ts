type Profile = {
  name: string;
  stats: {
    points: number;
  };
};

// A spread clone creates a new outer object but reuses nested references.
export function cloneProfile(profile: Profile): Profile {
  return { ...profile };
}
