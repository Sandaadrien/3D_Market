import { ButtonSignUpType } from "@/types/components";

const ButtonSignUp = ({ buttonParams }: { buttonParams: ButtonSignUpType }) => {
  return (
    <button className="bg-gray-50 border border-gray-800/80 flex px-2 py-3 gap-2 rounded-md items-center justify-center">
      {buttonParams.icon}
      <p className="text-xs">{buttonParams.text}</p>
    </button>
  );
};

export default ButtonSignUp;
