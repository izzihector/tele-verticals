/** @tele-module **/

    import EmployeeProfileFormView from '@hr/js/language';
    import { UpdateDeviceAccountControllerMixin } from 'tele_mobile.mixins';

    EmployeeProfileFormView.prototype.config.Controller.include(UpdateDeviceAccountControllerMixin);
