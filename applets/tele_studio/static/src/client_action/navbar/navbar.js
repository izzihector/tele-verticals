/** @tele-module **/

import { useService } from "@web/core/utils/hooks";
import { EnterpriseNavBar } from "@tele_enterprise/webclient/navbar/navbar";
import { NotEditableActionError } from "../../studio_service";
import { HomeMenuCustomizer } from "./home_menu_customizer/home_menu_customizer";
import { EditMenuItem } from "../../legacy/edit_menu_adapter";
import { NewModelItem } from "@tele_studio/legacy/new_model_adapter";

export class StudioNavbar extends EnterpriseNavBar {
    setup() {
        super.setup();
        this.studio = useService("studio");
        this.actionManager = useService("action");
        this.user = useService("user");
        this.dialogManager = useService("dialog");
        this.notification = useService("notification");
        owl.hooks.onMounted(() => {
            this.env.bus.off("HOME-MENU:TOGGLED", this);
            this._updateMenuAppsIcon();
        });
    }
    onMenuToggle() {
        this.studio.toggleHomeMenu();
    }
    closeStudio() {
        this.studio.leave();
    }
    async onNavBarDropdownItemSelection(ev) {
        if (ev.detail.payload.actionID) {
            try {
                await this.studio.open(this.studio.MODES.EDITOR, ev.detail.payload.actionID);
            } catch (e) {
                if (e instanceof NotEditableActionError) {
                    const options = { type: "danger" };
                    this.notification.add(
                        this.env._t("This action is not editable by Studio"),
                        options
                    );
                    return;
                }
                throw e;
            }
        }
    }
    get hasBackgroundAction() {
        return this.studio.editedAction || this.studio.MODES.APP_CREATOR === this.studio.mode;
    }
    get isInApp() {
        return this.studio.mode === this.studio.MODES.EDITOR;
    }
  
}
StudioNavbar.template = "tele_studio.StudioNavbar";
StudioNavbar.components.HomeMenuCustomizer = HomeMenuCustomizer;
StudioNavbar.components.EditMenuItem = EditMenuItem;
StudioNavbar.components.NewModelItem = NewModelItem;
