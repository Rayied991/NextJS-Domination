import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import events from "@/lib/constants";

const page = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Cannot Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups & Conferences, All in One Place.</p>
      <ExploreBtn/>

      <FeaturedEventsSection events={events} />
      </section>
  )
}

export default page;
