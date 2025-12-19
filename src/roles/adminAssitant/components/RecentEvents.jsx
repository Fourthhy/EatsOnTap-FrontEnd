function RecentEvents({ events, isHyerlink = true, canViewAll = true }) {
    return (
        <div
            className="h-auto bg-white rounded-xl shadow p-5 w-full">
            <div
                style={{ padding: "15px 0px 20px 15px", }}
                className="flex justify-between items-center mb-4">
                <h2
                    style={{ paddingLeft: "10px", fontFamily: "geist", fontWeight: "500", fontSize: 13, color: "#000" }}>
                    Recent Events
                </h2>

                {canViewAll && <a
                    href="#"
                    style={{
                        fontSize: 10,
                        color: "#254280",
                        fontFamily: "geist",
                        fontWeight: 500,
                        paddingRight: "25px"
                    }}
                    className="hover:underline">View All</a>}
            </div>
            <div
                style={{
                    paddingBottom: "20px",
                    margin: "0px 10px 0px 10px",
                }}
                className="flex flex-col gap-4">
                {events.map((event, idx) => (
                    <div
                        key={event.title}
                        style={{
                            padding: "10px 10px 10px 20px",
                            margin: "0px 10px 0px 10px",
                            background: 'linear-gradient(to right, #FDEDEC, #D8ECFF)',
                        }}
                        className="rounded-lg flex justify-between items-center">
                        <div
                            style={{ padding: "5px 0px 5px 0px" }}>
                            <h3
                                style={{
                                    fontFamily: "geist",
                                    fontSize: 13,
                                    color: "#000",
                                    fontWeight: "550"
                                }}
                                className="font-semibold text-gray-800 text-base">{event.title}</h3>
                            <p
                                style={{
                                    fontFamily: "geist",
                                    fontSize: 10,
                                    color: "#667085",
                                    fontWeight: "400"
                                }}
                                className="text-xs text-gray-700 mt-1">{event.date}</p>
                        </div>
                        {isHyerlink
                            ? <>
                                <a
                                    href={event.link}
                                    style={{
                                        fontSize: 10,
                                        color: "#254280",
                                        fontFamily: "geist",
                                        fontWeight: 500,
                                        paddingRight: "20px"
                                    }}
                                    className="hover:underline transition text-center">
                                    View <br />Details
                                </a>
                            </>
                            : ""}
                    </div>
                ))}
            </div>
        </div>
    );
}


export { RecentEvents };