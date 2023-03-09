import {
  connect,
  FieldIntentCtx,
  RenderPageCtx,
  IntentCtx,
  Field,
  RenderFieldExtensionCtx,
  RenderItemFormOutletCtx,
  ItemType,
} from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import ConfigScreen from "./entrypoints/ConfigScreen";
import { render } from "./render";
import "datocms-react-ui/styles.css";

import SamplePage from "./components/SamplePage";
import ChartEditor from "./components/ChartEditor";
import Kpi from "./components/Kpi";
import "./index.css";

import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
connect({
  mainNavigationTabs(ctx: IntentCtx) {
    return [
      {
        label: "Dataviz Utils",
        icon: "analytics",
        pointsTo: {
          pageId: "datavizzz",
        },
        placement: ["after", "settings"],
      },
    ];
  },
  renderPage(pageId, ctx: RenderPageCtx) {
    switch (pageId) {
      case "datavizzz":
        return render(<SamplePage ctx={ctx} />);
      case "settings":
        return null;
    }
  },
  itemFormOutlets(itemType: ItemType, ctx: IntentCtx) {
    if (itemType.attributes.api_key !== "kpi_element") {
      return [];
    }
    return [
      {
        id: "myOutlet",
        initialHeight: 100,
      },
    ];
  },
  renderItemFormOutlet(outletId: string, ctx: RenderItemFormOutletCtx) {
    return render(
      <Canvas ctx={ctx}>
        <div>
          <Kpi el={ctx.formValues} />
        </div>
      </Canvas>
    );
  },
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
    if (
      field.attributes.field_type === "json" &&
      field.attributes.api_key === "chart_data"
    ) {
      return {
        editor: { id: "chartEditor" },
      };
    } else if (
      field.attributes.field_type === "json" &&
      (field.attributes.api_key === "chart_datasource" ||
        field.attributes.api_key === "chart_config")
    ) {
      return {
        editor: { id: "emptyEditor" },
      };
    }
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case "chartEditor":
        return render(<ChartEditor ctx={ctx} />);
      case "emptyEditor":
        return render(<div />);
    }
  },
});
