import Events from "../Components/Events";
import News from "../Components/News";
import SuggestedGroup from "../Components/SuggestedGroup";
import useOfflineStatus from "../Hooks/useOfflineStatus";

export default function NewsAndInfo() {
  const isOffline = useOfflineStatus();

  return (
    <>
      <div className="-mt-5 h-full">
        <div className="">
          <Events isOffline={isOffline} />
        </div>
        <News isOffline={isOffline} />

        <div className="block xl:hidden">
          <SuggestedGroup isOffline={isOffline} />
        </div>
      </div>
    </>
  );
}
