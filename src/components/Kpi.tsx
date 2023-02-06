export default function kpi({ el }: { el: any }) {
  let border_classes =
    'primary-border-color-a9 border border-end-0 border-top-0 border-bottom-0 border-4';
  return (
    <div className={`p-2 ps-3 ${el.background_color} ${border_classes}`}>
      <div className="mid-caption--xlarge fw-semibold.text-black">
        {el.title}
      </div>
      <div>
        {el.value_prefix && (
          <span className="mid-caption--xxlarge primary-color-a9 fw-semibold me-3">
            {el.value_prefix}
          </span>
        )}
        <span className="mid-caption--xxlarge primary-color-a9 fw-semibold">
          {el.value}
        </span>

        {el.value_suffix && (
          <span className="mid-caption--xxlarge primary-color-a9 fw-semibold ms-3">
            {el.value_suffix}
          </span>
        )}
        {el.percentage && (
          <span className="mid-caption ms-3">{el.percentage}</span>
        )}

        {el.show_flow && (
          <span
            className={`${
              el.flow_direction == '+' ? 'bg-success' : 'bg-danger'
            } text-white py-1 px-3 rounded ms-3 mid-caption`}
          >
            {el.flow_value && (
              <span className="font-semibold">
                <span
                  className="me-3"
                  dangerouslySetInnerHTML={{
                    __html: el.flow_direction == '+' ? '&#8593;' : '&#8595;',
                  }}
                />
                {el.flow_value}
              </span>
            )}
            {el.flow_detail && <span className="ms-3">{el.flow_detail}</span>}
          </span>
        )}
      </div>
      {el.footer_text && (
        <div className="mid-caption pt-1 mt-3 border-top border-secondary">
          {el.footer_text}
        </div>
      )}
    </div>
  );
}
