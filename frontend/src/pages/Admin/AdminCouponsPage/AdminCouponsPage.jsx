import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaCopy, FaRedo, FaTicketAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { API } from "../../../axiosConfig/api";
import css from "./AdminCouponsPage.module.css";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : "—";

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await API.get("/coupons");
        setCoupons(response.data.data || []);
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message || "Could not load coupons.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesStatus =
        statusFilter === "all" || coupon.status === statusFilter;
      const matchesSearch =
        !query ||
        coupon.customerName?.toLowerCase().includes(query) ||
        coupon.customerEmail?.toLowerCase().includes(query) ||
        coupon.code?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [coupons, search, statusFilter]);

  const activeCount = coupons.filter(
    (coupon) => coupon.status === "active",
  ).length;
  const redeemedCount = coupons.length - activeCount;

  const handleStatusChange = async (coupon) => {
    const nextStatus = coupon.status === "active" ? "redeemed" : "active";
    setUpdatingId(coupon._id);

    try {
      const response = await API.patch(`/coupons/${coupon._id}/status`, {
        status: nextStatus,
      });
      setCoupons((currentCoupons) =>
        currentCoupons.map((item) =>
          item._id === coupon._id ? response.data.data : item,
        ),
      );
      toast.success(
        nextStatus === "redeemed"
          ? "Coupon marked as used."
          : "Coupon reactivated.",
      );
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message ||
          "Could not update the coupon.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied.");
    } catch {
      toast.info(code);
    }
  };

  return (
    <section className={css.page}>
      <div className={css.header}>
        <div>
          <p className={css.eyebrow}>WELCOME OFFER</p>
          <h1>Coupons</h1>
          <p>Track every $10 in-store welcome coupon in one place.</p>
        </div>
        <div className={css.headerIcon}>
          <FaTicketAlt />
        </div>
      </div>

      <div className={css.stats}>
        <div>
          <span>Total issued</span>
          <strong>{coupons.length}</strong>
        </div>
        <div>
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>
        <div>
          <span>Used</span>
          <strong>{redeemedCount}</strong>
        </div>
      </div>

      <div className={css.panel}>
        <div className={css.toolbar}>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or code"
            aria-label="Search coupons"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter coupons by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="redeemed">Used</option>
          </select>
        </div>

        {isLoading ? (
          <div className={css.message}>Loading coupons...</div>
        ) : error ? (
          <div className={`${css.message} ${css.error}`}>{error}</div>
        ) : filteredCoupons.length === 0 ? (
          <div className={css.message}>
            {coupons.length
              ? "No coupons match these filters."
              : "New customer coupons will appear here automatically."}
          </div>
        ) : (
          <div className={css.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Customer account</th>
                  <th>Coupon code</th>
                  <th>Value</th>
                  <th>Issued</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>
                      <strong>
                        {coupon.userId?.name || coupon.customerName}
                      </strong>
                      <span>
                        {coupon.userId?.email || coupon.customerEmail}
                      </span>
                      <small>
                        Account created {formatDate(coupon.userId?.createdAt)}
                      </small>
                    </td>
                    <td>
                      <div className={css.code}>
                        <strong>{coupon.code}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          aria-label={`Copy ${coupon.code}`}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </td>
                    <td>
                      ${coupon.discountAmount} {coupon.currency}
                    </td>
                    <td>{formatDate(coupon.createdAt)}</td>
                    <td>
                      <span
                        className={`${css.status} ${
                          coupon.status === "active"
                            ? css.active
                            : css.redeemed
                        }`}
                      >
                        {coupon.status === "active" ? "Active" : "Used"}
                      </span>
                      {coupon.redeemedAt && (
                        <small className={css.usedAt}>
                          {formatDate(coupon.redeemedAt)}
                        </small>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={css.action}
                        disabled={updatingId === coupon._id}
                        onClick={() => handleStatusChange(coupon)}
                      >
                        {coupon.status === "active" ? <FaCheck /> : <FaRedo />}
                        {coupon.status === "active"
                          ? "Mark used"
                          : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminCouponsPage;
