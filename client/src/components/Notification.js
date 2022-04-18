const Notification = ({ notification, closeNotification }) => {
    const { message, isShown } = notification;
    return (
        <div
            className={`fixed ${
                isShown ? "top-5" : "top-[-91.666667%] lg:top-[-400px]"
            } left-[50%] transform translate-x-[-50%] max-w-[500px] w-11/12 lg:w-[400px] py-5 px-10 flex items-center justify-between bg-dark border-b-4 border-b-primary rounded-lg z-[1338] transition-all duration-500 ease-in-out`}
            onClick={closeNotification}
        >
            <p className="text-white text-xl text-center pr-3">{message}</p>
        </div>
    );
};

export default Notification;
