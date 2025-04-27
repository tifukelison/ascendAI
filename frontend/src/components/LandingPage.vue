<template>
  <div class="landing-page">
    <h1 class="landing-header">A Second Brain for Career Growth</h1>
    <p class="landing-subtext">Unlock your potential with personalized insights and tools.</p>
    <router-link to="/signup"><button class="get-started-btn">Get Started</button></router-link>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f5f5f5; /* Example background color */
}

.landing-header {
  font-family: 'CrimsonPro', serif;
  font-size: 2.5rem;
  color: #333; /* Example text color */
  margin-bottom: 1rem;
}

.landing-subtext {
  font-family: 'CrimsonPro', serif;
  font-size: 1.25rem;
  color: #666; /* Example subtext color */
  margin-bottom: 2rem;
}

.get-started-btn {
  font-family: 'CrimsonPro', serif;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  color: #fff;
  background-color: #007bff; /* Example button color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.get-started-btn:hover {
  background-color: #0056b3; /* Example hover color */
}
</style>