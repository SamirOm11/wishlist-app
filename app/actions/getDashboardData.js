import handleFetchErrors from "../utils/handleFetchErrors"

export const getDashboardData = async ({ startDate, endDate }) => {
  try {
    const res = await fetch(
      `/api/dashboard?startDate=${startDate}&endDate=${endDate}`,
    );

    if (res.ok) {
      const data = await res.json();

      return { data };
    } else {
      const error = handleFetchErrors({ response: res });
      if (error) {
        return { error };
      }
    }
  } catch (error) {
    console.log("error: ", error);
    return { error };
  }
};
