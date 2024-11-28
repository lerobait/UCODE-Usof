import { TbMessageReply } from 'react-icons/tb';
import Button from '../Common/Button';

interface RepliesButtonProps {
  commentId: number;
  repliesCount: number;
  onRepliesToggle: (isVisible: boolean) => void;
  isRepliesVisible: boolean;
}

const RepliesButton: React.FC<RepliesButtonProps> = ({
  repliesCount,
  onRepliesToggle,
  isRepliesVisible,
}) => {
  const toggleReplies = () => {
    onRepliesToggle(!isRepliesVisible);
  };

  return (
    <Button
      onClick={toggleReplies}
      className="flex items-center text-gray-500 dark:text-white dark:hover:text-gray-500 hover:text-gray-700"
    >
      <TbMessageReply className="text-2xl" />
      <span className="ml-2">{repliesCount}</span>
    </Button>
  );
};

export default RepliesButton;
