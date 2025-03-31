import { makeAutoObservable } from "mobx";

class NotificationStore {
    notification = { open: false, message: '' }
    constructor() {
        makeAutoObservable(this)
    }
    addNotification(notification) {
        this.notification = notification
    }
    closeNotification() {
        this.notification = { open: false, message: '' }
    }
    get message() {
        return this.notification.message
    }
}

const notification = new NotificationStore()
export default notification