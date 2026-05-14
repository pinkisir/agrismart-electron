// ===== Mock Data =====

export const mockUsers = [
    { id: 1, username: 'admin', password: '123456', name: '管理员', role: 'admin' },
    { id: 2, username: 'operator', password: '123456', name: '操作员', role: 'operator' },
];

export const mockProjects = [
    {
        id: 1, name: '北区智慧大棚', location: '河北省保定市',
        area: 120, areaUnit: '亩', status: 'active',
        deviceCount: 24, onlineCount: 20, description: '蔬菜种植区，共6个温室大棚',
    },
    {
        id: 2, name: '南区露天农场', location: '河北省石家庄市',
        area: 350, areaUnit: '亩', status: 'active',
        deviceCount: 36, onlineCount: 34, description: '粮食作物种植区',
    },
    {
        id: 3, name: '东区果园基地', location: '山东省济南市',
        area: 80, areaUnit: '亩', status: 'inactive',
        deviceCount: 18, onlineCount: 10, description: '苹果、梨树种植区',
    },
];

export const mockDeviceCategories = [
    { id: 1, name: '灌溉阀门', code: 'VALVE', deviceCount: 32 },
    { id: 2, name: '土壤传感器', code: 'SOIL_SENSOR', deviceCount: 18 },
    { id: 3, name: '气象站', code: 'WEATHER', deviceCount: 4 },
    { id: 4, name: '摄像头', code: 'CAMERA', deviceCount: 8 },
    { id: 5, name: '水泵', code: 'PUMP', deviceCount: 6 },
];

export const mockCropCategories = [
    {
        id: 1, name: '蔬菜', children: [
            { id: 11, name: '叶菜类', remark: '生菜、菠菜等' },
            { id: 12, name: '茄果类', remark: '番茄、辣椒等' },
            { id: 13, name: '根茎类', remark: '胡萝卜、萝卜等' },
        ]
    },
    {
        id: 2, name: '粮食作物', children: [
            { id: 21, name: '小麦', remark: '' },
            { id: 22, name: '玉米', remark: '' },
        ]
    },
    {
        id: 3, name: '果树', children: [
            { id: 31, name: '苹果', remark: '' },
            { id: 32, name: '梨树', remark: '' },
        ]
    },
];

export const mockDevices = [
    { id: 1, name: '1号阀门控制器', code: 'DV-001', categoryId: 1, categoryName: '灌溉阀门', projectId: 1, location: 'A区-1号温室', status: 'online', lastOnline: '2025-05-14 08:30:00', firmwareVersion: 'v2.1.3', signal: 85 },
    { id: 2, name: '2号阀门控制器', code: 'DV-002', categoryId: 1, categoryName: '灌溉阀门', projectId: 1, location: 'A区-1号温室', status: 'online', lastOnline: '2025-05-14 08:29:00', firmwareVersion: 'v2.1.3', signal: 90 },
    { id: 3, name: '3号阀门控制器', code: 'DV-003', categoryId: 1, categoryName: '灌溉阀门', projectId: 1, location: 'A区-2号温室', status: 'offline', lastOnline: '2025-05-13 16:00:00', firmwareVersion: 'v2.1.0', signal: 0 },
    { id: 4, name: '4号阀门控制器', code: 'DV-004', categoryId: 1, categoryName: '灌溉阀门', projectId: 1, location: 'B区-3号温室', status: 'online', lastOnline: '2025-05-14 08:31:00', firmwareVersion: 'v2.1.3', signal: 78 },
    { id: 5, name: '5号阀门控制器', code: 'DV-005', categoryId: 1, categoryName: '灌溉阀门', projectId: 1, location: 'B区-3号温室', status: 'fault', lastOnline: '2025-05-14 06:00:00', firmwareVersion: 'v2.0.9', signal: 30 },
    { id: 6, name: '土壤传感器-01', code: 'SS-001', categoryId: 2, categoryName: '土壤传感器', projectId: 1, location: 'A区-1号温室', status: 'online', lastOnline: '2025-05-14 08:32:00', firmwareVersion: 'v1.3.0', signal: 92 },
    { id: 7, name: '土壤传感器-02', code: 'SS-002', categoryId: 2, categoryName: '土壤传感器', projectId: 1, location: 'B区-3号温室', status: 'online', lastOnline: '2025-05-14 08:30:00', firmwareVersion: 'v1.3.0', signal: 88 },
    { id: 8, name: '气象站-主站', code: 'WS-001', categoryId: 3, categoryName: '气象站', projectId: 1, location: '中心区域', status: 'online', lastOnline: '2025-05-14 08:33:00', firmwareVersion: 'v3.0.1', signal: 95 },
    { id: 9, name: '水泵-1号', code: 'PU-001', categoryId: 5, categoryName: '水泵', projectId: 1, location: '泵房', status: 'online', lastOnline: '2025-05-14 07:00:00', firmwareVersion: 'v1.0.5', signal: 80 },
    { id: 10, name: '摄像头-入口', code: 'CA-001', categoryId: 4, categoryName: '摄像头', projectId: 1, location: '大门入口', status: 'online', lastOnline: '2025-05-14 08:34:00', firmwareVersion: 'v4.2.0', signal: 88 },
];

export const mockValves = [
    { id: 1, name: '1号阀', code: 'V-001', projectId: 1, location: 'A区-1号温室-西侧', status: 'closed', deviceId: 1, flow: 0, pressure: 0.2 },
    { id: 2, name: '2号阀', code: 'V-002', projectId: 1, location: 'A区-1号温室-东侧', status: 'open', deviceId: 2, flow: 3.5, pressure: 0.4 },
    { id: 3, name: '3号阀', code: 'V-003', projectId: 1, location: 'A区-2号温室-西侧', status: 'closed', deviceId: 3, flow: 0, pressure: 0.1 },
    { id: 4, name: '4号阀', code: 'V-004', projectId: 1, location: 'A区-2号温室-东侧', status: 'closed', deviceId: 3, flow: 0, pressure: 0.1 },
    { id: 5, name: '5号阀', code: 'V-005', projectId: 1, location: 'B区-3号温室-南侧', status: 'open', deviceId: 4, flow: 4.2, pressure: 0.5 },
    { id: 6, name: '6号阀', code: 'V-006', projectId: 1, location: 'B区-3号温室-北侧', status: 'closed', deviceId: 4, flow: 0, pressure: 0.3 },
    { id: 7, name: '7号阀', code: 'V-007', projectId: 1, location: 'B区-4号温室-西侧', status: 'fault', deviceId: 5, flow: 0, pressure: 0 },
    { id: 8, name: '8号阀', code: 'V-008', projectId: 1, location: 'C区-露天-1区', status: 'closed', deviceId: null, flow: 0, pressure: 0.2 },
    { id: 9, name: '9号阀', code: 'V-009', projectId: 1, location: 'C区-露天-2区', status: 'closed', deviceId: null, flow: 0, pressure: 0.2 },
    { id: 10, name: '10号阀', code: 'V-010', projectId: 1, location: 'C区-露天-3区', status: 'open', deviceId: null, flow: 2.8, pressure: 0.35 },
    { id: 11, name: '11号阀', code: 'V-011', projectId: 1, location: 'D区-大棚-1区', status: 'closed', deviceId: null, flow: 0, pressure: 0.2 },
    { id: 12, name: '12号阀', code: 'V-012', projectId: 1, location: 'D区-大棚-2区', status: 'closed', deviceId: null, flow: 0, pressure: 0.2 },
];

export const mockIrrigationGroups = [
    { id: 1, name: 'A区温室组', projectId: 1, remark: 'A区所有温室阀门', valveIds: [1, 2, 3, 4], valveNames: ['1号阀', '2号阀', '3号阀', '4号阀'], duration: 30, unit: 'min', status: 'idle', createTime: '2024-02-01' },
    { id: 2, name: 'B区温室组', projectId: 1, remark: 'B区温室阀门', valveIds: [5, 6, 7], valveNames: ['5号阀', '6号阀', '7号阀'], duration: 45, unit: 'min', status: 'running', createTime: '2024-02-01' },
    { id: 3, name: 'C区露天组', projectId: 1, remark: '露天种植区灌溉', valveIds: [8, 9, 10], valveNames: ['8号阀', '9号阀', '10号阀'], duration: 60, unit: 'min', status: 'idle', createTime: '2024-03-15' },
    { id: 4, name: 'D区大棚组', projectId: 1, remark: 'D区大棚灌溉', valveIds: [11, 12], valveNames: ['11号阀', '12号阀'], duration: 20, unit: 'min', status: 'idle', createTime: '2024-04-10' },
];

export const mockIrrigationPlans = [
    { id: 1, name: '早晨常规灌溉', projectId: 1, groupId: 1, groupName: 'A区温室组', triggerType: 'cron', cronDesc: '每天 06:00', duration: 30, unit: 'min', enabled: true, lastRun: '2025-05-14 06:00:00', nextRun: '2025-05-15 06:00:00', createTime: '2024-02-10' },
    { id: 2, name: '午后补灌', projectId: 1, groupId: 3, groupName: 'C区露天组', triggerType: 'cron', cronDesc: '周一至周五 14:00', duration: 60, unit: 'min', enabled: true, lastRun: '2025-05-14 14:00:00', nextRun: '2025-05-15 14:00:00', createTime: '2024-03-20' },
    { id: 3, name: '傍晚滴灌', projectId: 1, groupId: 2, groupName: 'B区温室组', triggerType: 'cron', cronDesc: '每天 18:00', duration: 45, unit: 'min', enabled: false, lastRun: '2025-05-10 18:00:00', nextRun: '-', createTime: '2024-04-01' },
    { id: 4, name: 'D区周期灌溉', projectId: 1, groupId: 4, groupName: 'D区大棚组', triggerType: 'cron', cronDesc: '每周一三五 07:00', duration: 20, unit: 'min', enabled: true, lastRun: '2025-05-13 07:00:00', nextRun: '2025-05-15 07:00:00', createTime: '2024-04-15' },
];

export const mockIrrigationZones = [
    { id: 1, name: 'A区温室-1号棚', projectId: 1, sortOrder: 1, area: 20, cropName: '生菜', groupId: 1, groupName: 'A区温室组', remark: '叶菜种植' },
    { id: 2, name: 'A区温室-2号棚', projectId: 1, sortOrder: 2, area: 20, cropName: '菠菜', groupId: 1, groupName: 'A区温室组', remark: '叶菜种植' },
    { id: 3, name: 'B区温室-3号棚', projectId: 1, sortOrder: 3, area: 25, cropName: '番茄', groupId: 2, groupName: 'B区温室组', remark: '茄果类' },
    { id: 4, name: 'B区温室-4号棚', projectId: 1, sortOrder: 4, area: 25, cropName: '辣椒', groupId: 2, groupName: 'B区温室组', remark: '茄果类' },
    { id: 5, name: 'C区露天-1区', projectId: 1, sortOrder: 5, area: 50, cropName: '小麦', groupId: 3, groupName: 'C区露天组', remark: '粮食作物' },
    { id: 6, name: 'C区露天-2区', projectId: 1, sortOrder: 6, area: 60, cropName: '玉米', groupId: 3, groupName: 'C区露天组', remark: '粮食作物' },
    { id: 7, name: 'D区大棚-1区', projectId: 1, sortOrder: 7, area: 15, cropName: '胡萝卜', groupId: 4, groupName: 'D区大棚组', remark: '根茎类' },
];

export const mockAlerts = [
    { id: 1, level: 'error', title: '设备离线告警', content: '3号阀门控制器(DV-003)已离线超过12小时', time: '2025-05-14 08:00:00', read: false },
    { id: 2, level: 'warning', title: '设备故障告警', content: '5号阀门控制器(DV-005)信号弱', time: '2025-05-14 07:30:00', read: false },
    { id: 3, level: 'warning', title: '阀门异常', content: '7号阀(V-007)状态异常', time: '2025-05-14 06:15:00', read: true },
    { id: 4, level: 'info', title: '灌溉计划执行', content: '早晨常规灌溉计划已成功执行', time: '2025-05-14 06:32:00', read: true },
    { id: 5, level: 'info', title: '设备上线', content: '水泵-1号已恢复在线', time: '2025-05-14 07:00:00', read: true },
];
