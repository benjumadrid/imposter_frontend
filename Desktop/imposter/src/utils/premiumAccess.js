const API_URL = "https://game-backend-x355.onrender.com/api/premium";

export const LS_PREMIUM_KEY = "imposter_premium_unlocked";


// Check premium from backend
export async function checkPremium(device_id) {

  try {

    const res = await fetch(
      `${API_URL}/check/${device_id}`
    );

    const data = await res.json();


    if (data.premium) {

      localStorage.setItem(
        LS_PREMIUM_KEY,
        "true"
      );

      return true;

    }


    localStorage.removeItem(
      LS_PREMIUM_KEY
    );

    return false;


  } catch (err) {

    console.log(err);

    return false;

  }

}



// Quick local check
export function isPremiumUnlocked() {

  return (
    localStorage.getItem(LS_PREMIUM_KEY) === "true"
  );

}



// Testing only
export function revokePremium() {

  localStorage.removeItem(
    LS_PREMIUM_KEY
  );

}