/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { executeNotebook } from "../tasks/tasksSlice";
import CheckboxWidget from "./Widgets/Checkbox";
import NumericWidget from "./Widgets/Numeric";
import RangeWidget from "./Widgets/Range";
import SelectWidget from "./Widgets/Select";
import SliderWidget from "./Widgets/Slider";

import {
  isCheckboxWidget,
  isNumericWidget,
  isRangeWidget,
  isSelectWidget,
  isSliderWidget,
  IWidget,
} from "./Widgets/Types";
import { getWidgetsValues, setWidgetValue } from "./Widgets/widgetsSlice";

type SideBarProps = {
  notebookTitle: string;
  notebookId: number;
  loadingState: string;
  waiting: boolean;
  widgetsParams: Array<IWidget>;
  watchMode: boolean;
};

export default function SideBar({
  notebookTitle,
  notebookId,
  loadingState,
  waiting,
  widgetsParams,
  watchMode,
}: SideBarProps) {
  const dispatch = useDispatch();
  const widgetsValues = useSelector(getWidgetsValues);
  
  useEffect(() => {
    if (widgetsParams) {
      for (let [key, widgetParams] of Object.entries(widgetsParams)) {
        dispatch(setWidgetValue({ key, value: widgetParams.value }));
      }
    }
  }, [dispatch, widgetsParams]);

  let widgets = [];
  if (widgetsParams) {
    for (let [key, widgetParams] of Object.entries(widgetsParams)) {
      if (isSelectWidget(widgetParams)) {
        widgets.push(
          <SelectWidget
            widgetKey={key}
            disabled={waiting}
            label={widgetParams?.label}
            value={widgetsValues[key] as string}
            choices={widgetParams?.choices}
            multi={widgetParams?.multi}
            key={key}
          />
        );
      } else if (isCheckboxWidget(widgetParams)) {
        widgets.push(
          <CheckboxWidget
            widgetKey={key}
            disabled={waiting}
            label={widgetParams?.label}
            value={widgetsValues[key] as boolean}
            key={key}
          />
        );
      } else if (isNumericWidget(widgetParams)) {
        widgets.push(
          <NumericWidget
            widgetKey={key}
            disabled={waiting}
            label={widgetParams?.label}
            value={widgetsValues[key] as number}
            min={widgetParams?.min}
            max={widgetParams?.max}
            step={widgetParams?.step}
            key={key}
          />
        );
      } else if (isSliderWidget(widgetParams)) {
        widgets.push(
          <SliderWidget
            widgetKey={key}
            disabled={waiting}
            label={widgetParams?.label}
            value={widgetsValues[key] as number}
            min={widgetParams?.min}
            max={widgetParams?.max}
            step={widgetParams?.step}
            vertical={widgetParams?.vertical}
            key={key}
          />
        );
      } else if (isRangeWidget(widgetParams)) {
        widgets.push(
          <RangeWidget
            widgetKey={key}
            disabled={waiting}
            label={widgetParams?.label}
            value={widgetsValues[key] as [number, number]}
            min={widgetParams?.min}
            max={widgetParams?.max}
            step={widgetParams?.step}
            vertical={widgetParams?.vertical}
            key={key}
          />
        );
      }
    }
  }

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-3 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky p-3">
        <h4>{notebookTitle}</h4>
        <div style={{ padding: "0px" }}>
          <form>
            {widgets}

            <div className="form-group mb-3">
              <button
                type="button"
                className="btn btn-success"
                style={{ marginRight: "10px" }}
                onClick={() => dispatch(executeNotebook(notebookId))}
                disabled={waiting}
              >
                <i className="fa fa-play" aria-hidden="true"></i> Run
              </button>

              {/* <button
                type="button"
                className="btn btn-primary"
                disabled={waiting}
              >
                <i className="fa fa-download" aria-hidden="true"></i> Download
              </button> */}
            </div>
            {waiting && (
              <div className="alert alert-primary mb-3" role="alert">
                <i className="fa fa-cogs" aria-hidden="true"></i> Notebook is executed ...
              </div>
            )}
            {watchMode && (
              <div className="alert alert-secondary mb-3" role="alert">
                <i className="fa fa-refresh" aria-hidden="true"></i> Notebook in watch mode. All changes to Notebook will be automatically visible in Mercury.
              </div>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
}