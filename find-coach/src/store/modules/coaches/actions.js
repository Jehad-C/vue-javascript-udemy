export default {
    async registerCoach(context, data) {
        const userId = context.rootGetters.userId;
        const coachData = {
            firstName: data.first,
            lastName: data.last,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas,
        };

        const token = context.rootGetters.token;
        const baseUrl = 'https://vue-http-demo-ed1bf-default-rtdb.firebaseio.com';
        const dataUrl = `${baseUrl}/coaches/${userId}.json?auth=${token}`;
        await fetch(dataUrl, {
            method: 'PUT',
            body: JSON.stringify(coachData),
        });

        context.commit('registerCoach', {
            ...coachData,
            id: userId,
        });
    },
    async loadCoaches(context, payload) {
        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        const token = context.rootGetters.token;
        const baseUrl = 'https://vue-http-demo-ed1bf-default-rtdb.firebaseio.com/';
        const dataUrl = `${baseUrl}/coaches.json?auth=${token}`;

        const response = await fetch(dataUrl);
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch!');
            throw error;
        }

        const coaches = [];
        for (const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].rate,
                areas: responseData[key].areas,
            };
            coaches.push(coach);
        }
        context.commit('setCoaches', coaches);
        context.commit('setFetchTimestamp');
    }
}
