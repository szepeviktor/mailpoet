/* eslint-disable quote-props, quotes, comma-dangle, no-unused-vars */
const demoFormData = {
  "id": "1",
  "name": "A GDPR friendly form",
  "body": [
    {
      "type": "text",
      "name": "First name",
      "id": "first_name",
      "unique": "1",
      "static": "0",
      "params": {
        "label": "First name"
      },
      "position": "1"
    },
    {
      "type": "text",
      "name": "Email",
      "id": "email",
      "unique": "0",
      "static": "1",
      "params": {
        "label": "Email",
        "required": "true"
      },
      "position": "2"
    },
    {
      "type": "html",
      "name": "Custom text or HTML",
      "id": "html",
      "unique": "0",
      "static": "0",
      "params": {
        "text": "We keep your data private and share your data only with third parties that make this service possible. See our Privacy Policy for more information.",
        "nl2br": "0"
      },
      "position": "3"
    },
    {
      "type": "submit",
      "name": "Submit",
      "id": "submit",
      "unique": "0",
      "static": "1",
      "params": {
        "label": "Subscribe!"
      },
      "position": "4"
    }
  ],
  "settings": {
    "segments": [
      "3"
    ],
    "on_success": "message",
    "success_message": "Check your inbox or spam folder to confirm your subscription.",
    "success_page": "5",
    "segments_selected_by": "admin"
  },
  "styles": "/* form */\n.mailpoet_form {\n\n}\n\n/* paragraphs (label + input) */\n.mailpoet_paragraph {\n  line-height:20px;\n}\n\n/* labels */\n.mailpoet_segment_label,\n.mailpoet_text_label,\n.mailpoet_textarea_label,\n.mailpoet_select_label,\n.mailpoet_radio_label,\n.mailpoet_checkbox_label,\n.mailpoet_list_label,\n.mailpoet_date_label {\n  display:block;\n  font-weight:bold;\n}\n\n/* inputs */\n.mailpoet_text,\n.mailpoet_textarea,\n.mailpoet_select,\n.mailpoet_date_month,\n.mailpoet_date_day,\n.mailpoet_date_year,\n.mailpoet_date {\n  display:block;\n}\n\n.mailpoet_text,\n.mailpoet_textarea {\n  width:200px;\n}\n\n.mailpoet_checkbox {\n}\n\n.mailpoet_submit input {\n}\n\n.mailpoet_divider {\n}\n\n.mailpoet_message {\n}\n\n.mailpoet_validate_success {\n  font-weight: 600;\n  color:#468847;\n}\n\n.mailpoet_validate_error {\n  color:#B94A48;\n}\n\n.mailpoet_form_loading {\n  width: 30px;\n  text-align: center;\n  line-height: normal;\n}\n\n.mailpoet_form_loading > span {\n  width: 5px;\n  height: 5px;\n  background-color: #5b5b5b;\n}",
  "created_at": "2019-09-05 10:48:26",
  "updated_at": "2019-09-05 10:48:26",
  "deleted_at": null
};
/* eslint-enable quote-props, quotes, comma-dangle, no-unused-vars */

export const formData = window.mailpoet_form_data;

export function getBlocks(data) {
  return data.body.map((item) => {
    const mapped = {
      clientId: item.id,
      isValid: true,
      innerBlocks: [],
    };
    switch (item.type) {
      case 'text':
        mapped.name = 'mailpoet-form/input-field';
        if (item.id === 'email') {
          mapped.name = 'mailpoet-form/input-email';
        }
        if (item.id === 'first_name') {
          mapped.name = 'mailpoet-form/input-first-name';
        }
        mapped.attributes = {
          id: item.id,
          label: item.params.label,
          fieldType: item.id === 'email' ? 'email' : 'text',
          fieldName: item.id,
          useLabels: true,
        };
        return mapped;
      case 'submit':
        mapped.name = 'mailpoet-form/submit-button';
        mapped.attributes = {
          id: item.id,
          label: item.params.label,
        };
        return mapped;
      case 'html':
        mapped.name = 'core/html';
        mapped.attributes = {
          id: item.id,
          content: item.params.text,
        };
        return mapped;
      default:
        return null;
    }
  }).filter(Boolean);
}

export function getFormData(blocks, name, styles) {
  const saveFormData = {
    id: formData.id,
    settings: formData.settings,
    body: [],
    styles,
    name,
    created_at: formData.created_at,
    updated_at: formData.updated_at,
    deleted_at: formData.deleted_at,
  };

  saveFormData.body = blocks.map((block, index) => {
    const mapped = {
      id: block.attributes.id,
      unique: 0,
      static: 0,
      params: {},
      position: index + 1,
    };
    switch (block.name) {
      case 'mailpoet-form/input-field':
      case 'mailpoet-form/input-first-name':
      case 'mailpoet-form/input-email':
        mapped.type = 'text';
        mapped.name = block.attributes.label;
        mapped.static = block.name === 'mailpoet-form/input-field' ? 0 : 1;
        mapped.params.label = block.attributes.label;
        if (block.attributes.fieldType === 'email') {
          mapped.params.required = 1;
        }
        return mapped;
      case 'mailpoet-form/submit-button':
        mapped.type = 'submit';
        mapped.name = 'Submit';
        mapped.static = 1;
        mapped.params.label = block.attributes.label;
        return mapped;
      case 'core/html':
        mapped.type = 'html';
        mapped.name = 'Custom text or HTML';
        mapped.params.text = block.attributes.content;
        return mapped;
      default:
        return null;
    }
  }).filter(Boolean);

  return saveFormData;
}
