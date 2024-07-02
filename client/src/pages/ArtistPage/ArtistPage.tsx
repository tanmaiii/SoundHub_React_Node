import "./artistPage.scss";

import Track from "../../components/Track";
import Images from "../../constants/images";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { userApi } from "../../apis";
import { log } from "console";
import ImageWithFallback from "../../components/ImageWithFallback";
import { apiConfig } from "../../configs";
import { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import numeral from "numeral";

export default function ArtistPage() {
  const { id } = useParams();
  const { currentUser, token } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: async () => {
      try {
        const res = await userApi.getDetail(id ?? "");
        return res;
      } catch (error) {
        console.log(error);

        return null;
      }
    },
  });

  const { data: follow, isLoading: loadingFollow } = useQuery({
    queryKey: ["follow", id],
    queryFn: async () => {
      const res = await userApi.checkFollowing(id ?? "", token);
      return res.isFollowing;
    },
  });

  const { data: followers, isLoading: loadingFollower } = useQuery({
    queryKey: ["followers", id],
    queryFn: async () => {
      const res = await userApi.getCountFollowers(id ?? "");
      return res;
    },
  });

  const mutationFollow = useMutation({
    mutationFn: async (follow: boolean) => {
      try {
        console.log("follow");
        if (follow) return await userApi.unFollow(id ?? "", token);
        return await userApi.follow(id ?? "", token);
      } catch (err: any) {
        console.log(err.response.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follow", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["following"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-favorites"],
      });
      queryClient.invalidateQueries({
        queryKey: ["followers", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["artists-follow"],
      });
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="artist">
      <div className="artist__container">
        <div className="artist__container__hero">
          <div className="artist__container__hero__blur">
            <div className="bg-alpha"></div>
            <div
              className="blur"
              style={{
                backgroundImage: `url(${apiConfig.imageURL(
                  user?.image_path ?? ""
                )})`,
              }}
            ></div>
          </div>
          <div className="artist__container__hero__body">
            <div className="avatar">
              <ImageWithFallback
                src={user?.image_path ?? ""}
                fallbackSrc={Images.AVATAR}
                alt=""
              />
              {currentUser?.id === user?.id && (
                <div className="avatar__overlay">
                  <i className="fa-regular fa-pen-to-square"></i>
                  <span>Edit playlist</span>
                </div>
              )}
            </div>
            <div className="info">
              <div className="info__check">
                <i className="fa-duotone fa-badge-check"></i>
                <span>Verify</span>
              </div>
              <h2 className="info__name">{user?.name}</h2>
              <div className="info__desc">
                <span>
                  {numeral(followers).format("0a").toUpperCase()} followers
                </span>
                {currentUser?.id !== user?.id && (
                  <button
                    className=""
                    onClick={() => mutationFollow.mutate(follow ?? false)}
                  >
                    <span>{follow ? "Following" : "Follow"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="artist__container__content">
          <div className="artist__container__content__header">
            <button className="btn__play">
              <i className="fa-solid fa-play"></i>
            </button>

            <button>
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <div className="artist__container__content__top__section row">
            <div className="top__section__new col pc-4 t-12 m-12">
              <h4>New release</h4>
              <div className="top__section__new__list row">
                <div className="col pc-12 t-12 m-12">
                  {/* <Track time="3:03" title="Thằng điên 1" /> */}
                  {/* <Track time="3:03" title="Thằng điên 2" quantity={"12,330,000"} /> */}
                </div>
              </div>
            </div>
            <div className="top__section__popular col pc-8 t-12 m-12">
              <h4>Popular</h4>
              <div className="top__section__popular__list row">
                <div className="col pc-6 t-6 m-12">
                  {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                  {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                  {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                </div>
                <div className="col pc-6 t-6 m-12">
                  {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                  {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                  {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
