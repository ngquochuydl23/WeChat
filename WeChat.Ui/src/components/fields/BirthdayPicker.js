import { useFormik } from "formik"
import _ from "lodash"
import moment from "moment"
import * as Yup from "yup";
import { Stack, FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material"
import { useState, useEffect } from "react"

const BirthdayPicker = ({
    date,
    locale = 'vn',
    monthLabel = `Month`,
    dayLabel = `Day`,
    yearLabel = `Year`,
    reverse = false,
    onChange,
    sx,
    disabled = false,
    error = null,
}) => {

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            day: date ? Number(date.format('D')) : null,
            month: date ? Number(date.format('M')) : null,
            year: date ? Number(date.format('YYYY')) : null
        },
        validationSchema: Yup.object().shape({
            day: Yup
                .number()
                .required('Vui lòng chọn ngày'),
            month: Yup
                .number()
                .required('Vui lòng chọn tháng'),
            year: Yup
                .number()
                .required('Vui lòng chọn năm')
        }),
        initialTouched: {
            day: false,
            month: false,
            year: false
        },
        onSubmit: async values => {
            const { day, month, year } = values;
            formik.setTouched({
                year: false,
                month: false,
                day: false
            })

            var birthday = moment.utc();
            birthday.set('year', year);
            birthday.set('month', month - 1);
            birthday.set('date', day);
            birthday.startOf('day');
            onChange(birthday)
        },
    });

    const years = (back) => {
        const year = new Date().getFullYear();
        return Array.from({ length: back }, (v, i) => year - back + i + 1).reverse();
    }

    useEffect(() => {
        if ((formik.values.day && formik.values.month && formik.values.year) && (formik.touched.day || formik.touched.month || formik.touched.year)) {
            formik.submitForm();
        }
    }, [formik.values])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack direction={reverse ? "row-reverse" : "row"} spacing="15px" sx={{ ...sx }}>
                <FormControl fullWidth size="small">
                    <InputLabel
                        id="year.select.label"
                        sx={{
                            backgroundColor: 'white',
                            ...(error && {
                                color: 'red',
                                "&.Mui-focused": {
                                    color: "red"
                                }
                            })
                        }}
                        shrink={formik.values.year}>
                        {yearLabel}
                    </InputLabel>
                    <Select
                        touched
                        size="small"
                        labelId="year.select.label"
                        id="year.select"
                        disabled={disabled}
                        sx={{
                            ...(error && {
                                "&.MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "red"
                                    },
                                    "& fieldset legend span": {
                                        color: "red"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "red"
                                    },
                                    "& .MuiSelect-select": {
                                        color: 'red'
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: 'red'
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "red"
                                    }
                                },

                            })
                        }}
                        value={formik.values.year}
                        label={yearLabel}
                        onBlur={formik.handleBlur}
                        error={formik.errors.year && formik.touched.year}
                        helperText={formik.errors.year}
                        onChange={(event) => {
                            formik.setFieldTouched('year', true);
                            formik.setFieldValue('year', Number(event.target.value));
                        }}>
                        {_.map(years(100), (year) => (
                            <MenuItem value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small"  >
                    <InputLabel
                        id="month.select.label"
                        sx={{
                            backgroundColor: 'white',
                            ...(error && {
                                color: 'red',
                                "&.Mui-focused": {
                                    color: "red"
                                }
                            })
                        }}
                        shrink={formik.values.month}>
                        {monthLabel}
                    </InputLabel>
                    <Select
                        size="small"
                        labelId="month.select.label"
                        id="month.select.id"
                        disabled={disabled}
                        sx={{
                            ...(error && {
                                "&.MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "red"
                                    },
                                    "& fieldset legend span": {
                                        color: "red"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "red"
                                    },
                                    "& .MuiSelect-select": {
                                        color: 'red'
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: 'red'
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "red"
                                    }
                                },

                            })
                        }}
                        value={formik.values.month}
                        label={monthLabel}
                        onBlur={formik.handleBlur}
                        error={formik.errors.year && formik.touched.month}
                        helperText={formik.errors.month}
                        onChange={(event) => {
                            formik.setFieldTouched('month', true);
                            formik.setFieldValue('month', Number(event.target.value))
                        }}>
                        {_.map(moment.months(), (item, index) => (
                            <MenuItem value={index + 1}>{locale === 'vn' ? `Tháng ` + (index + 1) : item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" >
                    <InputLabel
                        id="day.select.label"
                        sx={{
                            backgroundColor: 'white',
                            ...(error && {
                                color: 'red',
                                "&.Mui-focused": {
                                    color: "red"
                                }
                            })
                        }}
                        shrink={formik.values.day}>
                        {dayLabel}
                    </InputLabel>
                    <Select
                        size="small"
                        labelId="day.select.label"
                        id="day.select.id"
                        disabled={disabled}
                        sx={{
                            ...(error && {
                                "&.MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "red"
                                    },
                                    "& fieldset legend span": {
                                        color: "red"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "red"
                                    },
                                    "& .MuiSelect-select": {
                                        color: 'red'
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: 'red'
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "red"
                                    }
                                },

                            })
                        }}
                        value={formik.values.day}
                        label={dayLabel}
                        onBlur={formik.handleBlur}
                        error={formik.errors.day && formik.touched.day}
                        helperText={formik.errors.day}
                        onChange={(event) => {
                            formik.setFieldTouched('day', true);
                            formik.setFieldValue('day', Number(event.target.value))
                        }}>
                        {_.map(new Array(moment().year(formik.values.year || 2019).month(formik.values.month || 1).daysInMonth()), (item, index) => (
                            <MenuItem value={index + 1}>{index + 1}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Stack>
            {error &&
                <FormHelperText sx={{ ml: '5px', color: 'red' }}>
                    {error}
                </FormHelperText>
            }
        </form >
    )
}

export default BirthdayPicker;