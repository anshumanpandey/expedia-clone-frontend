import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getSupplierInfo } from '../../crud/click-tracker.crud';
// @ts-ignore
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
// @ts-ignore
import Picker from 'rc-calendar/lib/Picker';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';


export const SuppliersTable: React.FC = () => {
    const [dates, setDates] = useState<[moment.Moment, moment.Moment]>([moment().startOf('month'), moment().endOf('month')])
    const [{ data, loading, error }, refetch] = useAxios(getSupplierInfo())

    const Calendar = () => {
        return (
            <Picker
                value={dates}
                onChange={(values: [moment.Moment, moment.Moment]) => {
                    return setDates(values);
                }}
                animation="slide-up"
                calendar={<RangeCalendar
                    showToday={false}
                    showWeekNumber
                    dateInputPlaceholder={['start', 'end']}
                    showOk={false}
                    showClear
                    onSelect={(e: any) => setDates(e)}
                />}
            >
                {
                    () => {
                        return (
                            <div style={{ padding: 'unset', margin: 'unset', boxShadow: 'unset'}} className="main-register">
                                <div className="custom-form">
                                    <input
                                        style={{ margin: 0, backgroundColor: 'white'}}
                                        type="text"
                                        placeholder="please select"
                                        readOnly
                                        className="ant-calendar-picker-input ant-input"
                                        value={`Showing click between ${dates[0].format('YYYY-MM-DD')} and ${dates[1].format('YYYY-MM-DD')}` || ''}
                                    />
                                </div>
                            </div>
                        );
                    }
                }
            </Picker>
        );
    }

    return (
        <div className="statistic-container fl-wrap">
            <DataTable
                actions={<Calendar />}
                progressPending={loading}
                columns={[
                    {
                        name: 'Supplier Name',
                        selector: 'clientname',
                    },
                    {
                        name: 'Total Click Amount',
                        selector: 'ClickTracks.length',
                        cell: (client: { ClickTracks: { created_at: string }[] }) => {
                            return client.ClickTracks.filter((click: { created_at: string }) => {
                                return moment(click.created_at, "YYYY-MM-DD HH:mm:ss").isBetween(dates[0], dates[1])
                            }).length
                        }
                    },
                ]}
                data={data}
            />
        </div>
    )
}
