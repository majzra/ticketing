
//This file is create so next js can detect the changes automatically inside k8s
module.exports = {
    webpack: (config) => {
        config.watchOptions.poll = 300;
        return config;
    },
};