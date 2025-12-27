import { useState } from "react";
import { LinkIDModal } from "./AddStudentModal";

const LinkStatusBadge = ({ isLinked, student }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const styles = {
        Linked: {
            backgroundColor: '#d1fae5',
            color: '#047857',
            dotColor: '#10b981',
            text: 'Linked'
        },
        Unlinked: {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            dotColor: '#ef4444',
            text: 'Not Yet Linked'
        }
    };

    const currentStyle = isLinked ? styles.Linked : styles.Unlinked;

    return (
        <>
            <span
                onClick={() => !isLinked && setIsModalOpen(true)}
                className={`group text-xs font-medium flex items-center w-fit transition-all
                    ${!isLinked ? 'cursor-pointer hover:bg-red-200 hover:text-red-800' : ''}`}
                style={{
                    padding: '4px 12px',
                    borderRadius: 12,
                    gap: '6px',
                    backgroundColor: currentStyle.backgroundColor,
                    color: currentStyle.color,
                }}
            >
                <span
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: 12,
                        backgroundColor: currentStyle.dotColor
                    }}
                />
                <span className={`${!isLinked ? 'group-hover:hidden inline' : ''}`}>
                    {currentStyle.text}
                </span>
                {!isLinked && (
                    <span className="hidden group-hover:inline font-semibold">
                        Link ID now
                    </span>
                )}
            </span>

            {/* ✅ Modal rendered properly */}
            {isModalOpen && (
                <LinkIDModal
                    isOpen={isModalOpen}
                    student={student}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export { LinkStatusBadge };
