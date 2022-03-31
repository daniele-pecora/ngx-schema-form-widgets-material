import { FormProperty } from 'ngx-schema-form'

declare var Croppie: any;

export const actions = {
  'action_1': (formProperty: FormProperty, parameters: any) => {
    console.log('Delete image via formProperty')
    //formProperty.setValue('', true)
    formProperty.reset('', true)
  },
  'action_edit_image': (formProperty: FormProperty, parameters: any) => {
    // npm install croppie
    // https://cdnjs.cloudflare.com/ajax/libs/croppie/{version}/croppie.min.css
    // https://cdnjs.cloudflare.com/ajax/libs/croppie/{version}/croppie.min.js

    formProperty.root.searchProperty('/files/editDialog').schema.widget.show = true

    const action = () => {
      var el = document.getElementById('vanilla-demo')
      var vanilla = new Croppie(el, {
        viewport: { width: 100, height: 100 },
        boundary: { width: 300, height: 300 },
        showZoomer: true,
        enableResize: true,
        enableOrientation: true,
        mouseWheelZoom: 'ctrl'
      })
      vanilla.bind({
        url: 'demo/demo-2.jpg',
        orientation: 4
      })
      //on button click
      vanilla.result('blob').then(function (blob) {
        // do something with cropped blob
      })

      const fileUpload = document.createElement('input')
      fileUpload.type = 'file'
      fileUpload.accept = 'image/*'
      el.parentElement.appendChild(fileUpload)

      function readFile(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            el.classList.add('ready');
            vanilla.bind({
              url: e.target.result
            }).then(function () {
              console.log('croppie bind complete')
            });
          }
          reader.readAsDataURL(input.files[0]);
        }
      }
      fileUpload.addEventListener('change', function () { readFile(this) })
    }

    if (!document.head.querySelector('#image-cropper')) {
      /**
       <link rel="stylesheet" href="croppie.css" />
        <script src="croppie.js"></script>
       */
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/croppie/2.6.5/croppie.js'
      script.id = 'image-cropper'
      script.onload = () => { action() }
      const link = document.createElement('link')
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/croppie/2.6.5/croppie.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      document.head.appendChild(script)
    } else {
      action()
    }

    //formProperty.root.searchProperty('/files/editDialogShow').setValue('show', false)

  }
}
