const getCurrentDate = () => {
    const addOrdinalIndicator = (day) => {
        switch (day) {
            case 1:
            case 21:
            case 31:
                return `${day}st`;
            case 2:
            case 22:
                return `${day}nd`;
            case 3:
            case 23:
                return`${day}rd`;
            default:
                return `${day}th`;
        }
    }
    let date = new Date();
    let month = date.toLocaleString('default', { month: 'long' });
    const isSeptember = date.getMonth() === 8;
    month = month.length < 5 ? month : `${month.substring(0, isSeptember ? 4 : 3)}.`;
    let day = addOrdinalIndicator(date.getDate());
    return `${month} ${day}`;
}