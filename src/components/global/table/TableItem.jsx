export function TableItem({ tableItemtype, value }) {

    const defaultTableItemDataStyle = {
        fontSize: 13,
        fontFamily: "geist",
        fontWeight: 400,
        color: "#231F20",
        paddingTop: '10px',
        paddingBottom: '10px',
        height: '100%'
    }

    const indexTableItemDataStyle = {
        ...defaultTableItemDataStyle,
        textAlign: "right",
        paddingRight: 20,
        fontWeight: 500,
    }

    const primaryInformationTableItemDataStyle = {
        ...defaultTableItemDataStyle,
        fontWeight: 500,
    }

    switch (tableItemtype) {
        case "index": 
            return (
                <td style={indexTableItemDataStyle}>
                    {value}
                </td>
            );
        break;
        case "primaryInformation":
            return (
                <td style={primaryInformationTableItemDataStyle}>{value}</td>
            )
        break;
        case "defaultInformation":
            return (
                <td style={defaultTableItemDataStyle}>{value}</td>
            )
        break;
    }
}