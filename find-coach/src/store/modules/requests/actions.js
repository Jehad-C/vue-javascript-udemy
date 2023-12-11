export default {
    async contactCoach(context, payload) {
        const newRequest = {
            id: new Date().toISOString(),
            userEmail: payload.email,
            message: payload.message,
        };

        const baseUrl = 'https://vue-http-demo-ed1bf-default-rtdb.firebaseio.com';
        const dataUrl = `${baseUrl}/requests/${payload.coachId}.json/`;
        const response = await fetch(dataUrl, {
            method: 'POST',
            body: JSON.stringify(newRequest),
        });

        const responseData = response.json();
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request.');
            throw error;
        }

        newRequest.id = responseData.name;
        newRequest.coachId = payload.coachId;
        context.commit('addRequest', newRequest);
    },
    async fetchRequests(context) {
        const coachId = context.rootGetters.userId;
        const baseUrl = 'https://vue-http-demo-ed1bf-default-rtdb.firebaseio.com';
        const dataUrl = `${baseUrl}/requests/${coachId}.json/`;
        const response = await fetch(dataUrl);
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request.');
            throw error;
        }

        const requests = [];
        for (const key in responseData) {
            const request = {
                id: key,
                coachId: coachId,
                userEmail: responseData[key].userEmail,
                message: responseData[key].message,
            };

            requests.push(request);
        }

        context.commit('setRequests', requests);
    },
};
