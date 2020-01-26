import moment from 'moment';
export function formatDateTime(s) {
    if (!s)
        return null;
    return moment(s).format('YYYY-MM-DD HH:mm:ss');
}

const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
export function formatFloat(f) {
    return formatter.format(f);
}