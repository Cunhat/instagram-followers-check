import { useEffect, useState } from "react";
import UploadFile from "./components/upload-file";

function App() {
  const [data, setData] = useState<{
    followers: any;
    following: any;
  } | null>(null);

  const [notFollowingBack, setNotFollowingBack] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.followers && data.following) {
      const notFollowingBack: any[] = [];
      const followers = data.followers;
      const following = data.following;

      following?.relationships_following?.forEach((followingProfile: any) => {
        const userName = followingProfile.string_list_data[0].value;

        const isFollowingBack = followers?.some(
          (follower: any) => follower.string_list_data[0].value === userName
        );

        if (!isFollowingBack) {
          notFollowingBack.push({
            name: userName,
            url: followingProfile.string_list_data[0].href,
          });
        }
      });
      setNotFollowingBack(notFollowingBack);
    }
  }, [data]);

  if (notFollowingBack.length > 0) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-6 overflow-hidden py-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold font-mono">
            Instagram Followers Checker
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            These are the people you are following that are not following you
            back
          </p>
          <p className="text-sm text-gray-500 font-mono">
            You have a total of <strong>{notFollowingBack.length}</strong>{" "}
            people not following you back
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 flex-1 overflow-y-auto w-full px-10">
          {notFollowingBack.map((profile) => (
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-gray-300 rounded-md text-center font-mono hover:bg-gray-100 transition-all duration-300"
            >
              <p>{profile.name}</p>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl font-bold font-mono">
        Instagram Followers Checker
      </h1>
      <h3 className="text-sm text-gray-500 font-mono text-lg">
        To check if your followers are following you back, you need to upload
        your followers and following lists.
      </h3>
      <ul className="list-disc list-inside text-sm text-gray-500 font-mono">
        <li className="text-sm text-gray-500 font-mono">
          Go to your Instagram account and download your information
        </li>
        <li className="text-sm text-gray-500 font-mono">
          You can download your information by going to your profile, clicking
          on the three dots in the top right corner, or go to your settings.
        </li>
        <li className="text-sm text-gray-500 font-mono">
          Go to{" "}
          <strong>
            Account Center {">"} Your information and Permissions {"> "}
            Download your information
          </strong>
        </li>
        <li className="text-sm text-gray-500 font-mono">
          Once you have downloaded your information, you can upload the files
          here.
        </li>
      </ul>

      <UploadFile setData={setData} />
    </div>
  );
}

export default App;
