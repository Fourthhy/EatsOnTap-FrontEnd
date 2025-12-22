import { useState } from "react"
import { useDate } from "../dashboard/DatePicker"
import { BandedChartTADMC } from "../charts/BandedChartTADMC"
import { BandedChartCUR } from "../charts/BandedChartCUR"
import { BandedChartOCF } from "../charts/BandedChartOCF"
import { CustomStatsCard } from "../dashboard/CustomStatsCard"
import { StatsCardGroup } from "../dashboard/StatsCardGroup"
import { BarChartBox } from "../charts/BarChartBox";
import { LineChartBox } from "../charts/LineChartBox";
import { QuickActions } from "../dashboard/QuickActions";
import { EventsPanel } from "../dashboard/EventsPanel";
import { AnalyticTabs } from "../dashboard/AnalyticTabs";
import { DatePicker } from "../dashboard/DatePicker"
import { HeaderBar } from "../../../../components/global/HeaderBar"
import { useOutletContext } from 'react-router-dom';

export default function StickyAdmin() {
    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', alignItems: 'start' }}>

                {/* 70% Scrollable Column */}
                <div style={{ padding: '20px' }}>
                    <h2>Main Content</h2>
                    {/* Imagine lots of content here that makes the page long */}
                    <div style={{ height: '2000px', background: '#f0f0f0' }}>
                        The user scrolls down through this...
                    </div>
                </div>

                {/* 30% Sticky Column */}
                <aside style={{
                    position: 'sticky',
                    top: '20px', // This is the gap from the top of the screen
                    padding: '20px',
                    background: '#e0e0e0',
                    height: 'fit-content' // Crucial: prevents the div from stretching to match the 70% column
                }}>
                    <h3>Sticky Sidebar</h3>
                    <p>I will stay put while you scroll!</p>
                </aside>

            </div>
        </>
    )
}