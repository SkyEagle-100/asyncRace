import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  moveCarById,
  makeDriveButtonId,
  makeStopButtonId,
} from "../../service/localService";
import {
  engineMode,
  removeCar,
  removeWinner,
  getCarById,
} from "../../service/service";
import { engineStatus } from "../../values";
import { ICar, IWinner } from "../../interfaces";
import "./car.css";

interface ICarProps {
  color: string;
  winnersList: IWinner[];
  fetchWinners: () => {};
  fetchCars: () => {};
  setCarToEdit: Dispatch<SetStateAction<ICar | undefined>>;
  setShowEditModal: Dispatch<SetStateAction<boolean>>;
  raceOn: boolean;
  id: number;
}

const Car: React.FC<ICarProps> = ({
  color,
  winnersList,
  fetchWinners,
  fetchCars,
  setCarToEdit,
  setShowEditModal,
  raceOn,
  id,
}) => {
  const [isMoving, setIsMoving] = useState(raceOn);

  const handleOnStopButtonClick = async (id: number) => {
    const car = document.getElementById(id + "");
    if (car) {
      car.style.animationPlayState = "paused"; // Приостанавливаем анимацию
      car.style.animationName = "none";
    }
    setIsMoving(false);
    engineMode(id, engineStatus.STOPPED);
  };

  const handleOnRemoveButtonClick = async (id: number) => {
    await removeCar(id);
    if (winnersList.find((w) => w.id === id)) {
      await removeWinner(id);
      fetchWinners();
    }
    fetchCars();
  };

  const handleOnEditButtonClick = async (id: number) => {
    const car = await getCarById(id);
    setCarToEdit(car);
    setShowEditModal(true);
  };

  const handleOnDriveButtonClick = async (id: number) => {
    moveCarById(id, setIsMoving);
  };

  return (
    <>
      <div id={`${id}`} key={id} className="car">
        <CarSVG color={color}></CarSVG>
      </div>
      <div className="car-buttons">
        <button onClick={() => handleOnEditButtonClick(id)}>E</button>
        <button onClick={() => handleOnRemoveButtonClick(id)}>R</button>
        <button
          id={makeDriveButtonId(id)}
          className={`${(raceOn || isMoving) && "disabled-button"}`}
          disabled={raceOn || isMoving}
          onClick={() => handleOnDriveButtonClick(id)}
        >
          D
        </button>
        <button
          id={makeStopButtonId(id)}
          className={`${!raceOn && !isMoving && "disabled-button"}`}
          disabled={!raceOn && !isMoving}
          onClick={() => handleOnStopButtonClick(id)}
        >
          S
        </button>
      </div>
    </>
  );
};

export default Car;

interface ICarSVGProps {
  color: string;
}

export const CarSVG: FC<ICarSVGProps> = ({ color }) => (
  <svg
    width="128"
    height="50"
    viewBox="0 0 197 94"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_11_26)">
      <path
        d="M78.3267 33.4768H96.1074C97.8662 33.4768 99.292 34.9026 99.292 36.6615V57.096C99.292 58.8548 97.8662 60.2806 96.1074 60.2806H78.3267M78.3267 33.4768H48.8691C47.1103 33.4768 45.6845 34.9026 45.6845 36.6615V57.096C45.6845 58.8548 47.1103 60.2806 48.8691 60.2806H78.3267M78.3267 33.4768V60.2806M14.3692 15.9615C14.3692 15.9615 19.6529 15.8134 22.0653 13.8384C24.1146 12.1608 25.5153 8 25.5153 8M14.3692 76.469C14.3692 76.469 19.6529 76.6171 22.0653 78.5921C24.1146 80.2697 25.5153 84.4305 25.5153 84.4305M12.2461 20.473H20.1861C20.8573 20.473 21.3437 21.1134 21.1602 21.759C20.0372 25.7115 16.773 37.9312 16.7577 46.4807C16.7421 55.1247 20.0344 67.4899 21.1615 71.4685C21.3444 72.1139 20.858 72.7536 20.1871 72.7536H11.9808M177.58 15.1654C177.58 15.1654 177.377 20.0699 179.438 21.8C181.437 23.4779 186.073 22.5961 186.073 22.5961M177.315 78.8575C177.315 78.8575 177.117 73.3882 179.178 71.6582C181.177 69.9803 185.813 70.862 185.813 70.862M45.1537 80.7152L63.996 75.4075H103.273L122.115 80.7152M45.1537 12.7769L63.996 18.0846H103.273L122.115 12.7769M82.3075 75.4075L91.3305 80.4498M82.3075 18.0846L91.3305 13.0423M146.265 46.746C146.248 57.1899 141.845 71.9583 140.222 77.0498C139.898 78.0666 138.825 78.624 137.8 78.327L113.066 71.1614C112.041 70.8642 111.427 69.8142 111.655 68.7712C112.578 64.5614 114.694 54.0963 114.684 46.746C114.674 39.4702 112.566 29.1112 111.65 24.9552C111.423 23.9247 112.019 22.8848 113.028 22.5738L137.776 14.9411C138.809 14.6225 139.904 15.1808 140.232 16.2111C141.869 21.3632 146.282 36.2323 146.265 46.746ZM48.6512 9.32692H159.846C162.466 9.32692 165.08 9.60373 167.563 10.4404C174.596 12.8104 189 19.1825 189 31.6192V59.2191C189 77.4904 171.653 82.6142 165.737 83.8303C164.439 84.0973 163.124 84.1652 161.798 84.1652H48.592C47.7303 84.1652 46.8783 84.346 46.0909 84.6959C45.3035 85.0459 44.4532 85.227 43.5916 85.2194C40.0544 85.1885 30.1167 85.0254 23.6659 84.1652C10.9263 82.4663 8.21928 63.0952 8.00828 47.5422C7.77973 30.6961 12.2533 7.99952 25.2582 8C31.1849 8.00022 40.1501 8.00009 43.5369 8.00003C44.4329 8.00001 45.3077 8.22834 46.0909 8.66348C46.8741 9.09859 47.7553 9.32692 48.6512 9.32692Z"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
    </g>
    <path
      d="M78.3267 33.4768H96.1074C97.8662 33.4768 99.292 34.9026 99.292 36.6615V57.096C99.292 58.8548 97.8662 60.2806 96.1074 60.2806H78.3267M78.3267 33.4768H48.8691C47.1103 33.4768 45.6845 34.9026 45.6845 36.6615V57.096C45.6845 58.8548 47.1103 60.2806 48.8691 60.2806H78.3267M78.3267 33.4768V60.2806M14.3692 15.9615C14.3692 15.9615 19.6529 15.8134 22.0653 13.8384C24.1146 12.1608 25.5153 8 25.5153 8M14.3692 76.469C14.3692 76.469 19.6529 76.6171 22.0653 78.5921C24.1146 80.2697 25.5153 84.4305 25.5153 84.4305M12.2461 20.473H20.1861C20.8573 20.473 21.3437 21.1134 21.1602 21.759C20.0372 25.7115 16.773 37.9312 16.7577 46.4807C16.7421 55.1247 20.0344 67.4899 21.1615 71.4685C21.3444 72.1139 20.858 72.7536 20.1871 72.7536H11.9808M177.58 15.1654C177.58 15.1654 177.377 20.0699 179.438 21.8C181.437 23.4779 186.073 22.5961 186.073 22.5961M177.315 78.8575C177.315 78.8575 177.117 73.3882 179.178 71.6582C181.177 69.9803 185.813 70.862 185.813 70.862M45.1537 80.7152L63.996 75.4075H103.273L122.115 80.7152M45.1537 12.7769L63.996 18.0846H103.273L122.115 12.7769M82.3075 75.4075L91.3305 80.4498M82.3075 18.0846L91.3305 13.0423M146.265 46.746C146.248 57.1899 141.845 71.9583 140.222 77.0498C139.898 78.0666 138.825 78.624 137.8 78.327L113.066 71.1614C112.041 70.8642 111.427 69.8142 111.655 68.7712C112.578 64.5614 114.694 54.0963 114.684 46.746C114.674 39.4702 112.566 29.1112 111.65 24.9552C111.423 23.9247 112.019 22.8848 113.028 22.5738L137.776 14.9411C138.809 14.6225 139.904 15.1808 140.232 16.2111C141.869 21.3632 146.282 36.2323 146.265 46.746ZM48.6512 9.32692H159.846C162.466 9.32692 165.08 9.60373 167.563 10.4404C174.596 12.8104 189 19.1825 189 31.6192V59.2191C189 77.4904 171.653 82.6142 165.737 83.8303C164.439 84.0973 163.124 84.1652 161.798 84.1652H48.592C47.7303 84.1652 46.8783 84.346 46.0909 84.6959C45.3035 85.0459 44.4532 85.227 43.5916 85.2194C40.0544 85.1885 30.1167 85.0254 23.6659 84.1652C10.9263 82.4663 8.21928 63.0952 8.00828 47.5422C7.77973 30.6961 12.2533 7.99952 25.2582 8C31.1849 8.00022 40.1501 8.00009 43.5369 8.00003C44.4329 8.00001 45.3077 8.22834 46.0909 8.66348C46.8741 9.09859 47.7553 9.32692 48.6512 9.32692Z"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <defs>
      <filter
        id="filter0_f_11_26"
        x="7.62939e-06"
        y="-0.000549316"
        width="197"
        height="93.2202"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="3"
          result="effect1_foregroundBlur_11_26"
        />
      </filter>
    </defs>
  </svg>
);
