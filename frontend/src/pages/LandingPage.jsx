import FindStation from '../components/FindStation';
import Nav from '../components/Nav';
import '../styles/LandingPage.css'
import Hero from '../components/Hero';
import WhatYouNeed from '../components/WhatYouNeed';
import MakeTheMostOfZ from '../components/makeTheMostOfZ';
import Footer from '../components/Footer';

function LandingPage() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <FindStation />
      <Hero />
      <WhatYouNeed />
      <MakeTheMostOfZ />
      <Footer />
    </div>
  )
}

export default LandingPage
