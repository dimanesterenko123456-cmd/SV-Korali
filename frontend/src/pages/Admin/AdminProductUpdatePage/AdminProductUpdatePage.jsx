import {
  FaChevronRight,
  FaEye,
  FaTrash,
  FaStar,
  FaPlus,
  FaCloudUploadAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import css from "./AdminProductUpdatePage.module.css";

const AdminProductUpdatePage = () => {
  // поки що статичні дані — потім сюди підтягуєш продукт з бекенду
  const productName = "Classic Carpathian Coral";

  return (
    <section id="update-form-section" className={css.page}>
      <div className={css.container}>
        {/* breadcrumbs + top actions */}
        <div className={css.topRow}>
          <div className={css.breadcrumbs}>
            <button className={css.breadcrumbLink}>Products</button>
            <FaChevronRight className={css.breadcrumbIcon} />
            <span className={css.breadcrumbCurrent}>{productName}</span>
          </div>

          <div className={css.topActions}>
            <button className={css.secondaryBtn}>
              <FaEye className={css.btnIcon} />
              Preview
            </button>
            <button className={css.dangerGhostBtn}>
              <FaTrash className={css.btnIcon} />
              Delete
            </button>
          </div>
        </div>

        <div className={css.grid}>
          {/* LEFT COLUMN */}
          <div className={css.leftCol}>
            {/* Basic info */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Basic information</h2>

              <div className={css.cardBody}>
                <div className={css.field}>
                  <label className={css.label}>Product name</label>
                  <input
                    type="text"
                    className={css.input}
                    defaultValue={productName}
                  />
                </div>

                <div className={css.field}>
                  <label className={css.label}>Description</label>
                  <textarea
                    rows={4}
                    className={`${css.input} ${css.textarea}`}
                    defaultValue="Handcrafted with authentic Carpathian coral beads, this traditional Ukrainian necklace represents centuries of cultural heritage."
                  />
                </div>

                <div className={css.fieldRow}>
                  <div className={css.field}>
                    <label className={css.label}>Category</label>
                    <select className={css.input} defaultValue="traditional">
                      <option value="traditional">
                        Traditional collection
                      </option>
                      <option value="heritage">Heritage collection</option>
                      <option value="modern">Modern collection</option>
                      <option value="custom">Custom collection</option>
                    </select>
                  </div>

                  <div className={css.field}>
                    <label className={css.label}>Status</label>
                    <select className={css.input} defaultValue="active">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & inventory */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Pricing & inventory</h2>

              <div className={css.cardBody}>
                <div className={css.fieldRow}>
                  <div className={css.field}>
                    <label className={css.label}>Price</label>
                    <div className={css.inputWithPrefix}>
                      <span className={css.inputPrefix}>$</span>
                      <input
                        type="number"
                        className={css.input}
                        defaultValue={189}
                      />
                    </div>
                  </div>

                  <div className={css.field}>
                    <label className={css.label}>Compare at price</label>
                    <div className={css.inputWithPrefix}>
                      <span className={css.inputPrefix}>$</span>
                      <input
                        type="number"
                        className={css.input}
                        defaultValue={249}
                      />
                    </div>
                  </div>
                </div>

                <div className={css.fieldRow}>
                  <div className={css.field}>
                    <label className={css.label}>SKU</label>
                    <input
                      type="text"
                      className={css.input}
                      defaultValue="CCC-001-TR"
                    />
                  </div>

                  <div className={css.field}>
                    <label className={css.label}>Stock quantity</label>
                    <input
                      type="number"
                      className={css.input}
                      defaultValue={24}
                    />
                  </div>
                </div>

                <label className={css.checkboxRow}>
                  <input type="checkbox" defaultChecked />
                  <span>Track inventory for this product</span>
                </label>
              </div>
            </div>

            {/* Specifications */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Product specifications</h2>

              <div className={css.cardBody}>
                <div className={css.fieldRow}>
                  <div className={css.field}>
                    <label className={css.label}>Material</label>
                    <input
                      type="text"
                      className={css.input}
                      defaultValue="Natural coral, silver"
                    />
                  </div>

                  <div className={css.field}>
                    <label className={css.label}>Length</label>
                    <input
                      type="text"
                      className={css.input}
                      defaultValue="18 inches"
                    />
                  </div>
                </div>

                <div className={css.fieldRow}>
                  <div className={css.field}>
                    <label className={css.label}>Weight</label>
                    <input
                      type="text"
                      className={css.input}
                      defaultValue="45 g"
                    />
                  </div>

                  <div className={css.field}>
                    <label className={css.label}>Origin</label>
                    <input
                      type="text"
                      className={css.input}
                      defaultValue="Carpathian Mountains"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>SEO information</h2>

              <div className={css.cardBody}>
                <div className={css.field}>
                  <label className={css.label}>Meta title</label>
                  <input
                    type="text"
                    className={css.input}
                    defaultValue="Classic Carpathian Coral Necklace - Traditional Ukrainian Jewelry"
                  />
                  <p className={css.helperText}>~60 characters</p>
                </div>

                <div className={css.field}>
                  <label className={css.label}>Meta description</label>
                  <textarea
                    rows={3}
                    className={`${css.input} ${css.textarea}`}
                    defaultValue="Authentic handcrafted Ukrainian coral necklace from the Carpathian region. Traditional design with natural coral beads and silver accents."
                  />
                  <p className={css.helperText}>~145 characters</p>
                </div>

                <div className={css.field}>
                  <label className={css.label}>URL slug</label>
                  <input
                    type="text"
                    className={css.input}
                    defaultValue="classic-carpathian-coral-necklace"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={css.rightCol}>
            {/* Images */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Product images</h2>

              <div className={css.cardBody}>
                <div className={css.mainImageWrapper}>
                  <div className={css.mainImage}>
                    {/* тут потім підставиш реальне фото */}
                    <div className={css.mainImagePlaceholder}>Main image</div>
                  </div>

                  <div className={css.mainImageBadges}>
                    <span className={css.primaryBadge}>Primary</span>
                    <button
                      type="button"
                      className={css.trashIconBtn}
                      aria-label="Delete image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className={css.thumbGrid}>
                  <div className={css.thumb} />
                  <div className={css.thumb} />
                  <button type="button" className={css.thumbAdd}>
                    <FaPlus />
                  </button>
                </div>

                <button type="button" className={css.uploadBtn}>
                  <FaCloudUploadAlt className={css.btnIcon} />
                  Upload images
                </button>
              </div>
            </div>

            {/* Status */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Status</h2>
              <div className={css.cardBody}>
                <div className={css.statusRow}>
                  <span className={css.statusLabel}>Visibility</span>
                  <span className={css.statusValue}>Public</span>
                </div>
                <div className={css.statusRow}>
                  <span className={css.statusLabel}>Featured</span>
                  <label className={css.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={css.toggleTrack}>
                      <span className={css.toggleThumb} />
                    </span>
                  </label>
                </div>
                <div className={css.statusRow}>
                  <span className={css.statusLabel}>Reviews</span>
                  <span className={css.statusValue}>
                    <FaStar className={css.starIcon} />
                    5.0 (24)
                  </span>
                </div>
                <div className={css.statusRow}>
                  <span className={css.statusLabel}>Last updated</span>
                  <span className={css.statusValue}>2 days ago</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Tags</h2>

              <div className={css.cardBody}>
                <div className={css.tags}>
                  {["Traditional", "Handmade", "Coral"].map((tag) => (
                    <span key={tag} className={css.tag}>
                      {tag}
                      <button
                        type="button"
                        className={css.tagRemove}
                        aria-label={`Remove ${tag}`}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  className={css.input}
                  placeholder="Add new tag…"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={css.footerActions}>
          <button type="button" className={css.secondaryBtn}>
            Cancel
          </button>

          <div className={css.footerRight}>
            <button type="button" className={css.secondaryBtn}>
              Save as draft
            </button>
            <button type="button" className={css.primaryBtn}>
              <FaSave className={css.btnIcon} />
              Update product
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductUpdatePage;
