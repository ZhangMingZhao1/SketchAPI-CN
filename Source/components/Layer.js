import { WrappedObject, DefinedPropertiesKey } from '../WrappedObject'
import { Rectangle } from '../Rectangle'
import { wrapObject, wrapNativeObject } from '../wrapNativeObject'

export const DEFAULT_EXPORT_OPTIONS = {
  compact: false,
  'include-namespaces': false,
  compression: 1.0,
  'group-contents-only': false,
  overwriting: false,
  progressive: false,
  'save-for-web': false,
  'use-id-for-name': false,
  trimmed: false,
  output: '~/Documents/Sketch Exports',
}

/**
 * Abstract class that represents a Sketch layer.
 */
export class Layer extends WrappedObject {
  /**
   * Duplicate this layer.
   * A new identical layer will be inserted into the parent of this layer.
   *
   * @return {Layer} A new layer identical to this one.
   */
  duplicate() {
    const object = this._object
    const duplicate = object.copy()
    object.parentGroup().insertLayers_afterLayer_([duplicate], object)
    return wrapNativeObject(duplicate)
  }

  /**
   * Remove this layer from its parent.
   */
  remove() {
    const parent = this._object.parentGroup()
    if (parent) {
      parent.removeLayer_(this._object)
    }
    return this
  }

  /**
   * Select the layer.
   * This will clear the previous selection. Use addToSelection() if you wish
   * to preserve the existing selection.
   */
  select() {
    this._object.select_byExtendingSelection(true, false)
    return this
  }

  /**
   * Deselect this layer.
   * Any other layers that were previously selected will remain selected.
   */
  deselect() {
    this._object.select_byExtendingSelection(false, true)
    return this
  }

  /**
   * Add this layer to the selected layers.
   * Any other layers that were previously selected will remain selected.
   */
  addToSelection() {
    this._object.select_byExtendingSelection(true, true)
    return this
  }

  /**
   * Move this layer to the front of its container.
   */
  moveToFront() {
    MSLayerMovement.moveToFront([this._object])
    return this
  }

  /**
   * Move this layer forward in its container.
   */
  moveForward() {
    MSLayerMovement.moveForward([this._object])
    return this
  }

  /**
   * Move this layer to the back of its container.
   */
  moveToBack() {
    MSLayerMovement.moveToBack([this._object])
    return this
  }

  /**
   * Move this layer backwards in its container.
   */
  moveBackward() {
    MSLayerMovement.moveBackward([this._object])
    return this
  }

  /**
   * Convert a rectangle in the coordinates that this layer uses to absolute (page) coordinates.
   *
   * @param {Rectangle} rect The rectangle to convert.
   * @return {Rectangle} The converted rectangle expressed in page coordinates.
   */
  localRectToPageRect(rect) {
    const _rect = this._object.convertRectToAbsoluteCoordinates(rect.asCGRect)
    return new Rectangle(_rect.x, _rect.y, _rect.width, _rect.height)
  }

  /**
   * Convert a rectangle in the coordinates that this layer uses to it's parent's coordinates.
   *
   * @param {Rectangle} rect The rectangle to convert.
   * @return {Rectangle} The converted rectangle expressed in the coordinate system of the parent layer.
   */
  localRectToParentRect(rect) {
    const { frame } = this
    return new Rectangle(
      rect.x + frame.x,
      rect.y + frame.y,
      rect.width,
      rect.height
    )
  }

  /**
   * Export this layer, using the options supplied.
   *
   * @discussion
   *
   * You can specify a lot of different options for the exporting.
   *
   * ### General Options
   *
   * - use-id-for-name : normally the exported files are given the same names as the layers they represent, but if this options is true, then the layer ids are used instead; defaults to false.
   * - output : this is the path of the folder where all exported files are placed; defaults to "~/Documents/Sketch Exports"
   * - overwriting : if true, the exporter will overwrite any existing files with new ones; defaults to false.
   * - trimmed: if true, any transparent space around the exported image will be trimmed; defaults to false.
   * - scales: this should be a list of numbers; it will determine the sizes at which the layers are exported; defaults to "1"
   * - formats: this should be a list of one or more of "png", "jpg", "svg", and "pdf"; defaults to "png" (see discussion below)
   *
   * ### SVG options
   * - compact : if exporting as SVG, this option makes the output more compact; defaults to false.
   * - include-namespaces : if exporting as SVG, this option includes extra attributes; defaults to false.
   *
   * ### PNG options
   * - save-for-web : if exporting a PNG, this option removes metadata such as the colour profile from the exported file; defaults to false.
   *
   * ### JPG options
   * - compression : if exporting a JPG, this option determines the level of compression, with 0 being the minimum, 1.0 the maximum; defaults to 1.0
   * - progressive : if exporting a JPG, this option makes it progressive; defaults to false.
   * - group-contents-only : false,
   *
   *
   * @param {dictionary} options Options indicating which sizes and formats to use, etc.
   */
  export(options) {
    const merged = { ...DEFAULT_EXPORT_OPTIONS, ...options }
    const exporter = MSSelfContainedHighLevelExporter.alloc().initWithOptions(
      merged
    )
    exporter.exportLayers([this.sketchObject])
    return this
  }
}

Layer[DefinedPropertiesKey] = { ...WrappedObject[DefinedPropertiesKey] }

Layer.define('index', {
  exportable: false,
  /**
   * Return the index of this layer in it's container.
   * The layer at the back of the container (visually) will be layer 0. The layer at the front will be layer n - 1 (if there are n layers).
   *
   * @return {number} The layer order.
   */
  get() {
    const ourLayer = this._object
    return parseInt(ourLayer.parentGroup().indexOfLayer_(ourLayer), 10)
  },
})

Layer.define('parent', {
  exportable: false,
  /**
   * Return the parent container of this layer.
   *
   * @return {Group} The containing layer of this layer.
   */
  get() {
    return wrapNativeObject(this._object.parentGroup())
  },
  set(layer) {
    layer = wrapObject(layer) // eslint-disable-line

    if (this._object.parentGroup()) {
      this._object.removeFromParent()
    }

    layer._object.addLayers([this._object])
  },
})

Layer.define('frame', {
  /**
   * The frame of the layer.
   * This is given in coordinates that are local to the parent of the layer.
   *
   * @return {Rectangle} The layer's frame.
   */
  get() {
    const f = this._object.frame()
    return new Rectangle(f.x(), f.y(), f.width(), f.height())
  },

  /**
   * Set the frame of the layer.
   * This will move and/or resize the layer as appropriate.
   * The new frame should be given in coordinates that are local to the parent of the layer.
   *
   * @param {Rectangle} frame - The new frame of the layer.
   */
  set(value) {
    const f = this._object.frame()
    f.setRect(NSMakeRect(value.x, value.y, value.width, value.height))
  },
})

Layer.define('name', {
  /**
   * The name of the layer.
   *
   * @return {string} The layer's name.
   */
  get() {
    return String(this._object.name())
  },

  /**
   * Set the name of the layer.
   *
   * @param {string} name The new name.
   */
  set(value) {
    this._object.setName(value)
  },
})