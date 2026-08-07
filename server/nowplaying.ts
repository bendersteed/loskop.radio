export default defineEventHandler(async (event) => {
  try {
    // Nuxt's $fetch automatically handles parsing the JSON response
    const data = await $fetch(
      "https://loazuracast.stinpriza.eu/api/nowplaying/1",
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch AzuraCast data:", error);
    return null;
  }
});
