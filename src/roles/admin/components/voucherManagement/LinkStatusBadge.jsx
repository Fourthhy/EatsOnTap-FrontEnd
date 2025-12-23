const LinkStatusBadge = ({ isLinked, student }) => {
    const status = isLinked ? 'Linked' : 'Unlinked';

    const styles = {
        Linked: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Linked' },
        Unlinked: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444', text: 'Not Yet Linked' }
    };

    const currentStyle = styles[status];

    return (
        <span
            onClick={() => !isLinked && handleOpenLinkModal(student)}
            className={`text-xs font-medium flex items-center w-fit transition-all ${!isLinked ? 'cursor-pointer hover:bg-red-200 hover:text-red-800' : ''}`}
            style={{
                padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentStyle.dotColor }}></span>
            <span className={`${!isLinked ? 'group-hover:hidden inline' : ''}`}>{currentStyle.text}</span>
            <span className={`hidden ${!isLinked ? 'group-hover:inline' : ''}`} style={{ fontWeight: 600 }}>Link ID now</span>
        </span>
    );
};

export { LinkStatusBadge }