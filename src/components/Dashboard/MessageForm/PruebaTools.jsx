
import { AiOutlineRetweet } from 'react-icons/ai';
import { HiOutlineHeart } from 'react-icons/hi';
import { IoStatsChart } from 'react-icons/io5';
import { PiChatCircleDots } from 'react-icons/pi';


const Tools = () => {
  return (
    <div className="tools formatted">
      <div className="tool" id="chat">
        <span className="count">12</span>
        <PiChatCircleDots className="icon" />
      </div>
      <div className="tool" id="retweet">
        <span className="count">33</span>
        <AiOutlineRetweet className="icon" />
      </div>
      <div className="tool" id="heart">
        <span className="count">2048</span>
        <HiOutlineHeart className="icon" />
      </div>
      <div className="tool" id="tn">
        <span className="count">69</span>
        <span className="icon top-new">TN</span>
      </div>
      <div className="tool" id="stats">
        <span className="count">90</span>
        <IoStatsChart className="icon" />
      </div>
    </div>
  );
};

export default Tools;
