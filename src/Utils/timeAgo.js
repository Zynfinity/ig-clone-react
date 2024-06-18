function timeAgo(timestamp) {
    const units = [
        { name: 'detik', limit: 60, in_seconds: 1 },
        { name: 'menit', limit: 3600, in_seconds: 60 },
        { name: 'jam', limit: 86400, in_seconds: 3600 },
        { name: 'hari', limit: 604800, in_seconds: 86400 },
        { name: 'minggu', limit: 2419200, in_seconds: 604800 },
        { name: 'bulan', limit: 29030400, in_seconds: 2419200 },
        { name: 'tahun', limit: Infinity, in_seconds: 29030400 }
    ];

    const diffInSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const unit = units.find(u => diffInSeconds < u.limit);

    const count = Math.floor(diffInSeconds / unit.in_seconds);
    return `${count} ${unit.name} yang lalu`;
}
export default timeAgo;
