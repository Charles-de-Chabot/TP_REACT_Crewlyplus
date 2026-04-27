import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';

// Style de base
import 'flatpickr/dist/flatpickr.min.css';

const BoatCalendar = ({ label = "Dates de séjour", startDate, endDate, onDateChange }) => {
    const calendarRef = useRef(null);
    const flatpickrInstance = useRef(null);

    useEffect(() => {
        if (calendarRef.current) {
            flatpickrInstance.current = flatpickr(calendarRef.current, {
                mode: "range",
                inline: true,
                minDate: "today",
                dateFormat: "Y-m-d",
                locale: French,
                defaultDate: startDate && endDate ? [startDate, endDate] : null,
                onChange: (selectedDates) => {
                    if (selectedDates.length === 2) {
                        const start = selectedDates[0].toLocaleDateString('en-CA');
                        const end = selectedDates[1].toLocaleDateString('en-CA');
                        onDateChange(start, end);
                    }
                }
            });
        }

        return () => {
            if (flatpickrInstance.current) {
                flatpickrInstance.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (!startDate && !endDate && flatpickrInstance.current) {
            flatpickrInstance.current.clear();
        }
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col items-center">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 text-center">
                {label}
            </label>
            <div ref={calendarRef} className="flatpickr-elite-container"></div>
        </div>
    );
};

export default BoatCalendar;